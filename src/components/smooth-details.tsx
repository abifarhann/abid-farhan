"use client";

import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from "react";

export function SmoothDetails({ id, label, summary, children, className = "" }: {
  id: string;
  label: string;
  summary: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<{ animation: Animation; contentAnimation: Animation; targetOpen: boolean } | null>(null);

  const settle = useCallback(() => {
    const transition = transitionRef.current;
    const details = detailsRef.current;
    if (!transition) return;
    transitionRef.current = null;
    transition.animation.cancel();
    transition.contentAnimation.cancel();
    if (details) {
      details.open = transition.targetOpen;
      delete details.dataset.disclosureState;
    }
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (motion.matches) settle();
    };
    motion.addEventListener("change", onMotionChange);
    window.addEventListener("resize", settle);
    return () => {
      settle();
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", settle);
    };
  }, [settle]);

  const toggle = (event: MouseEvent<HTMLElement>) => {
    const details = detailsRef.current;
    const heading = summaryRef.current;
    const content = contentRef.current;
    if (!details || !heading || !content) return;
    event.preventDefault();

    // Read the currently displayed height before cancelling, so rapid clicks reverse smoothly.
    const startHeight = details.getBoundingClientRect().height;
    const contentStyle = details.open ? getComputedStyle(content) : null;
    const startOpacity = contentStyle?.opacity ?? "0";
    const startTransform = contentStyle?.transform ?? "translateY(-6px)";
    const targetOpen = !(transitionRef.current?.targetOpen ?? details.open);
    transitionRef.current?.animation.cancel();
    transitionRef.current?.contentAnimation.cancel();
    transitionRef.current = null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof details.animate !== "function") {
      details.open = targetOpen;
      delete details.dataset.disclosureState;
      return;
    }

    details.open = true;
    details.dataset.disclosureState = targetOpen ? "opening" : "closing";
    const style = getComputedStyle(details);
    const borderHeight = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const endHeight = targetOpen
      ? details.getBoundingClientRect().height
      : heading.getBoundingClientRect().height + borderHeight;
    const animation = details.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 480, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" },
    );
    const contentAnimation = content.animate(
      [
        { opacity: startOpacity, transform: startTransform },
        { opacity: targetOpen ? "1" : "0", transform: targetOpen ? "translateY(0)" : "translateY(-6px)" },
      ],
      { duration: 480, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" },
    );
    transitionRef.current = { animation, contentAnimation, targetOpen };
    animation.onfinish = () => {
      if (transitionRef.current?.animation === animation) settle();
    };
  };

  return (
    <details ref={detailsRef} className={`project-details ${className}`.trim()} id={id}>
      <summary ref={summaryRef} aria-label={label} onClick={toggle}>
        {summary}<span aria-hidden="true">+</span>
      </summary>
      <div ref={contentRef} className="disclosure-motion-content">{children}</div>
    </details>
  );
}
