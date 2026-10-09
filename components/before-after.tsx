"use client";

import Image from "next/image";
import { useState } from "react";

type BeforeAfterProps = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
};

const defaults = {
  beforeSrc: "/projects/black-board-and-batten-barn/01_BEFORE/before-red-barn-corner-angle.jpg",
  afterSrc: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-barn-corner-hero.jpg",
  beforeAlt: "Existing red metal barn exterior with open wall sections before renovation",
  afterAlt: "Completed barn with black board-and-batten metal siding by Heritage Build Group",
};

export function BeforeAfter({
  beforeSrc = defaults.beforeSrc,
  afterSrc = defaults.afterSrc,
  beforeAlt = defaults.beforeAlt,
  afterAlt = defaults.afterAlt,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="before-after before-after--portrait" style={{ "--position": `${position}%` } as React.CSSProperties}>
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(max-width: 800px) 100vw, 1240px"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <div className="before-after__before">
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(max-width: 800px) 100vw, 1240px"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <span className="before-after__label before-after__label--before">BEFORE</span>
      <span className="before-after__label before-after__label--after">AFTER</span>
      <div className="before-after__line" aria-hidden="true">
        <span>‹ ›</span>
      </div>
      <input
        aria-label="Compare the barn exterior before and after"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  );
}
