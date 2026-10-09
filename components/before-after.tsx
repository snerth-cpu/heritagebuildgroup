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
  beforeSrc: "/images/02_before_front.jpeg",
  afterSrc: "/images/metal-exterior-wide.png",
  beforeAlt: "Building exterior before metal roofing and siding renovation",
  afterAlt: "Completed metal roofing and vertical ribbed metal siding after renovation",
};

export function BeforeAfter({
  beforeSrc = defaults.beforeSrc,
  afterSrc = defaults.afterSrc,
  beforeAlt = defaults.beforeAlt,
  afterAlt = defaults.afterAlt,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="before-after" style={{ "--position": `${position}%` } as React.CSSProperties}>
      <Image src={afterSrc} alt={afterAlt} fill sizes="(max-width: 800px) 100vw, 1240px" />
      <div className="before-after__before">
        <Image src={beforeSrc} alt={beforeAlt} fill sizes="(max-width: 800px) 100vw, 1240px" />
      </div>
      <span className="before-after__label before-after__label--before">BEFORE</span>
      <span className="before-after__label before-after__label--after">AFTER</span>
      <div className="before-after__line" aria-hidden="true">
        <span>‹ ›</span>
      </div>
      <input
        aria-label="Compare the exterior before and after"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  );
}
