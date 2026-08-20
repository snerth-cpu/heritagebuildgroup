"use client";

import Image from "next/image";
import { useState } from "react";

export function BeforeAfter() {
  const [position, setPosition] = useState(50);
  return <div className="before-after" style={{ "--position": `${position}%` } as React.CSSProperties}>
    <Image src="/images/metal-exterior-wide.png" alt="Completed metal roofing and vertical ribbed metal siding after renovation" fill sizes="(max-width: 800px) 100vw, 1240px" />
    <div className="before-after__before"><Image src="/images/02_before_front.jpeg" alt="Building exterior before metal roofing and siding renovation" fill sizes="(max-width: 800px) 100vw, 1240px" /></div>
    <span className="before-after__label before-after__label--before">BEFORE</span><span className="before-after__label before-after__label--after">AFTER</span>
    <div className="before-after__line" aria-hidden="true"><span>‹ ›</span></div>
    <input aria-label="Compare the exterior before and after" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} />
  </div>;
}
