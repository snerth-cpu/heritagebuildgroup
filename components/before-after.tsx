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
  beforeSrc: "/projects/black-board-and-batten-barn/01_BEFORE/before-red-barn-front-angle.jpeg",
  afterSrc: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-board-batten-hero-angle.jpeg",
  beforeAlt: "Existing red metal barn exterior before HBG Construction siding renovation",
  afterAlt: "Completed barn with black board-and-batten-style metal siding by HBG Construction",
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

export function BeforeAfterSideBySide({
  beforeSrc = defaults.beforeSrc,
  afterSrc = defaults.afterSrc,
  beforeAlt = defaults.beforeAlt,
  afterAlt = defaults.afterAlt,
}: BeforeAfterProps) {
  return (
    <div className="ba-pair" aria-label="Before and after comparison">
      <figure className="ba-pair__item">
        <div className="ba-pair__frame">
          <Image src={beforeSrc} alt={beforeAlt} fill sizes="(max-width: 800px) 100vw, 620px" />
        </div>
        <figcaption>BEFORE</figcaption>
      </figure>
      <figure className="ba-pair__item">
        <div className="ba-pair__frame">
          <Image src={afterSrc} alt={afterAlt} fill sizes="(max-width: 800px) 100vw, 620px" />
        </div>
        <figcaption>AFTER</figcaption>
      </figure>
    </div>
  );
}
