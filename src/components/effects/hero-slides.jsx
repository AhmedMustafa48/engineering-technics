"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5500;

// Cross-fading photo slideshow for the hero. Only the visible slide runs the Ken Burns zoom, so each
// image starts its motion afresh when it comes round.
export function HeroSlides({ images }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <>
      {images.map((image, i) => (
        <Image
          key={image.src}
          src={image.src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          style={{ objectPosition: image.position }}
          className={cn(
            "object-cover transition-opacity duration-[1400ms] ease-in-out",
            i === active ? "animate-kenburns opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2 sm:right-10">
        {images.map((image, i) => (
          <span
            key={image.src}
            className={cn(
              "h-1.5 rounded-full bg-white transition-all duration-500",
              i === active ? "w-8 opacity-100" : "w-3 opacity-40",
            )}
          />
        ))}
      </div>
    </>
  );
}
