"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand-logo";
import { PhoneLink } from "@/components/phone-link";
import { serviceCategories, uniqueCategoryLinks } from "@/lib/service-categories";
import {
  BUSINESS_EMAIL,
  BUSINESS_HIC,
  CONTACT_HREF,
  ESTIMATE_HREF,
  LEGAL_NAME,
  SERVICE_AREA_REGION,
  SERVICE_AREA_STATEMENT,
} from "@/lib/seo";

const primaryLinks = [
  ["Our Work", "/projects"],
  ["About", "/about"],
  ["Contact", CONTACT_HREF],
] as const;

const lightHeaderPaths = new Set(["/about", "/estimate", "/projects", "/contact", "/service-areas"]);

const allServiceHrefs = new Set(uniqueCategoryLinks().map((item) => item.href));

export { Mark } from "@/components/brand-logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const onLight = lightHeaderPaths.has(pathname) || pathname.startsWith("/service-areas/");
  const estimateActive = pathname === "/estimate";
  const servicesActive =
    allServiceHrefs.has(pathname) ||
    pathname.startsWith("/barn-siding") ||
    pathname.startsWith("/commercial") ||
    pathname.startsWith("/additions") ||
    pathname.startsWith("/buildings");
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
              className={`nav__dropdown-trigger${servicesActive ? " active" : ""}${servicesOpen ? " is-open" : ""}`}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setServicesOpen((value) => !value);
              }}
            >
              Services <span aria-hidden="true">{servicesOpen ? "▴" : "▾"}</span>
            </button>
            {servicesOpen ? (
              <div className="nav__dropdown-panel nav__dropdown-panel--categories" role="menu">
                <div className="nav__dropdown-toolbar">
                  <span className="nav__dropdown-toolbar-label">Services</span>
                  <button
                    type="button"
                    className="nav__dropdown-close"
                    aria-label="Close services menu"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setServicesOpen(false);
                    }}
                  >
                    Close ✕
                  </button>
                </div>
                {serviceCategories.map((category) => (
                  <div className="nav__dropdown-group" key={category.id}>
                    <p className="nav__dropdown-heading">{category.title}</p>
                    {category.items.map((item) => (
                      <Link
                        key={`${category.id}-${item.label}`}
                        href={item.href}
                        role="menuitem"
                        className={pathname === item.href ? "active" : ""}
                        onClick={() => {
                          setOpen(false);
                          setServicesOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {primaryLinks.map(([label, href]) => (
            <Link
              className={pathname === href || (href === "/projects" && pathname.startsWith("/projects/")) ? "active" : ""}
              key={href}
              href={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <PhoneLink className="nav__phone" onClick={() => setOpen(false)} />
          <Link
            className={`nav__cta${estimateActive ? " active" : ""}`}
            href={ESTIMATE_HREF}
            onClick={() => setOpen(false)}
          >
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Fixed mobile call + quote bar — hidden on contact and estimate pages. */
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
    <div className="mobile-contact-cta" role="group" aria-label="Contact options">
      <PhoneLink prefix="Call " />
      <Link href={ESTIMATE_HREF}>Request a Quote</Link>
    </div>
  );
}

export function Footer() {
  const serviceLinks = uniqueCategoryLinks();
  return (
    <footer className="footer">
      <div className="footer__top wrap">
        <Mark size="footer" />
        <div>
          <p className="eyebrow">EXTERIOR CONSTRUCTION</p>
          <p>{SERVICE_AREA_STATEMENT}</p>
          <p className="footer__contact">
            <PhoneLink />
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>
          <nav className="footer__links" aria-label="Footer service links">
            {serviceLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/barn-siding">Barn Siding</Link>
            <Link href="/additions">Additions</Link>
            <Link href="/commercial">Commercial Exteriors</Link>
            <Link href="/projects">Our Work</Link>
            <Link href="/about">About</Link>
            <Link href={CONTACT_HREF}>Contact</Link>
            <Link href="/service-areas">Service Areas</Link>
          </nav>
        </div>
        <Link className="arrow-link" href={ESTIMATE_HREF}>
          REQUEST A QUOTE <span>↗</span>
        </Link>
      </div>
      <div className="footer__bottom wrap">
        <p>© {new Date().getFullYear()} {LEGAL_NAME}</p>
        <p>PA Registered & Fully Insured · {BUSINESS_HIC}</p>
        <p>{SERVICE_AREA_REGION}</p>
      </div>
    </footer>
  );
}
