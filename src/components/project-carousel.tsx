"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function ProjectCarousel({ slides, title, href, sizes, unoptimized }: {
  slides: { image: string; alt: string }[];
  title: string;
  href: string;
  sizes: string;
  unoptimized: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 4000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion, slides.length]);

  return (
    <div className="project-image image-volcano-app project-carousel" role="region" aria-roledescription="carousel" aria-label={`${title} previews`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}>
      <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {slides.map((slide, index) => <a key={slide.image} className="carousel-slide" href={href} tabIndex={active === index ? 0 : -1} aria-hidden={active !== index} aria-label={`Read about ${title}`}>
          <Image src={slide.image} alt={slide.alt} fill sizes={sizes} unoptimized={unoptimized} />
        </a>)}
      </div>
      <span className="image-open" aria-hidden="true">↗</span>
      <div className="carousel-controls">
        <div className="carousel-dots" aria-label="Choose preview">
          {slides.map((slide, index) => <button key={slide.image} type="button" aria-label={`Show preview ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)}><span /></button>)}
        </div>
        {!reducedMotion && <button className="carousel-pause" type="button" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused((value) => !value)}>{paused ? "▶" : "Ⅱ"}</button>}
      </div>
    </div>
  );
}
