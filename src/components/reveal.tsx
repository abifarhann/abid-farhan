"use client";

import { useEffect } from "react";

export function Reveal() {
  useEffect(() => {
    const openLinkedProject = () => {
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        target.querySelector("summary")?.focus({ preventScroll: true });
      }
    };
    const onProjectLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href$="-details"]');
      if (!link) return;
      const target = document.getElementById(link.hash.slice(1));
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        target.querySelector("summary")?.focus({ preventScroll: true });
      }
    };
    openLinkedProject();
    window.addEventListener("hashchange", openLinkedProject);
    document.addEventListener("click", onProjectLink);
    return () => {
      window.removeEventListener("hashchange", openLinkedProject);
      document.removeEventListener("click", onProjectLink);
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!motion.matches) {
            const delay = Math.min(180, Math.max(0, Number(entry.target.getAttribute("data-reveal-delay")) || 0));
            const animation = entry.target.animate(
              [{ opacity: 0.65, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: 700, delay, fill: "backwards", easing: "cubic-bezier(.22,1,.36,1)" },
            );
            animations.add(animation);
            animation.addEventListener("finish", () => animations.delete(animation), { once: true });
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    const cancelAnimations = () => {
      if (motion.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    motion.addEventListener("change", cancelAnimations);
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", cancelAnimations);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);
  return null;
}
