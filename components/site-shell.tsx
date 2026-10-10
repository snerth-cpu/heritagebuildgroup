"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand-logo";
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_PHONE_HREF, CONTACT_HREF, ESTIMATE_HREF, LEGAL_NAME } from "@/lib/seo";

const serviceLinks = [
  ["Metal Roofing", "/metal-roofing"],
  ["Metal Siding", "/metal-siding"],
  ["Pole Buildings", "/pole-buildings"],
  ["Garages", "/garages"],
  ["Additions", "/additions"],
  ["Commercial Exteriors", "/commercial"],
] as const;

const primaryLinks = [
  ["Projects", "/projects"],
  ["About", "/about"],
  ["Contact", CONTACT_HREF],
] as const;

const lightHeaderPaths = new Set(["/about", "/estimate", "/projects", "/contact", "/service-areas"]);

export { Mark } from "@/components/brand-logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const onLight = lightHeaderPaths.has(pathname) || pathname.startsWith("/service-areas/");
  const estimateActive = pathname === "/estimate";
  const servicesActive = serviceLinks.some(([, href]) => pathname === href || pathname.startsWith(`${href}/`));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  return (
    <header className={`header ${onLight ? "header--light" : ""}`}>
      <div className="header__inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <Mark size="nav" priority />
        </Link>
        <button
          className="menu"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav className={open ? "nav nav--open" : "nav"} aria-label="Main navigation">
          <div className={`nav__dropdown${servicesOpen ? " nav__dropdown--open" : ""}`} ref={dropdownRef}>
            <button
              type="button"
              className={`nav__dropdown-trigger${servicesActive ? " active" : ""}`}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((value) => !value)}
            >
              Services <span aria-hidden="true">▾</span>
            </button>
            <div className="nav__dropdown-panel" role="menu">
              {serviceLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  className={pathname === href ? "active" : ""}
                  onClick={() => {
                    setOpen(false);
                    setServicesOpen(false);
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          {primaryLinks.map(([label, href]) => (
            <Link
              className={pathname === href ? "active" : ""}
              key={href}
              href={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            className={`nav__cta${estimateActive ? " active" : ""}`}
            href={ESTIMATE_HREF}
            onClick={() => setOpen(false)}
          >
            Get an Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Fixed mobile estimate control — hidden on contact and estimate pages. */
export function MobileContactCta() {
  const pathname = usePathname();
  const hidden = pathname === CONTACT_HREF || pathname === "/estimate";

  useEffect(() => {
    if (hidden) {
      document.body.classList.remove("has-mobile-contact-cta");
      return;
    }
    document.body.classList.add("has-mobile-contact-cta");
    return () => document.body.classList.remove("has-mobile-contact-cta");
  }, [hidden]);

  if (hidden) return null;
  return (
    <Link href={ESTIMATE_HREF} className="mobile-contact-cta">
      REQUEST AN ESTIMATE
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top wrap">
        <Mark size="footer" />
        <div>
          <p className="eyebrow">METAL EXTERIORS &amp; BUILDINGS • WESTERN PENNSYLVANIA</p>
          <p>Serving Greater Pittsburgh, Cranberry Township, Butler County, Mercer County, and Erie County.</p>
          <p className="footer__contact">
            <a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>
          <nav className="footer__links" aria-label="Footer service links">
            <Link href="/metal-roofing">Metal Roofing</Link>
            <Link href="/metal-siding">Metal Siding</Link>
            <Link href="/pole-buildings">Pole Buildings</Link>
            <Link href="/garages">Garages</Link>
            <Link href="/additions">Additions</Link>
            <Link href="/commercial">Commercial Exteriors</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
            <Link href={CONTACT_HREF}>Contact</Link>
            <Link href="/service-areas">Service Areas</Link>
          </nav>
        </div>
        <Link className="arrow-link" href={ESTIMATE_HREF}>
          REQUEST AN ESTIMATE <span>↗</span>
        </Link>
      </div>
      <div className="footer__bottom wrap">
        <p>© {new Date().getFullYear()} {LEGAL_NAME}</p>
        <p>PA Registered & Fully Insured · PA HIC #PA223621</p>
        <p>Western Pennsylvania</p>
      </div>
    </footer>
  );
}
