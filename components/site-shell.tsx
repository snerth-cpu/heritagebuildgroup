"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark } from "@/components/brand-logo";
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_PHONE_HREF, CONTACT_HREF, ESTIMATE_HREF, LEGAL_NAME } from "@/lib/seo";

const nav = [
  ["Metal Roofing", "/metal-roofing"], ["Metal Siding", "/metal-siding"],
  ["Buildings", "/buildings"], ["Commercial", "/commercial"],
  ["Projects", "/projects"], ["About", "/about"],
] as const;

const lightHeaderPaths = new Set(["/about", "/estimate", "/projects", "/contact"]);

export { Mark } from "@/components/brand-logo";

export function Header() {
  const [open, setOpen] = useState(false); const pathname = usePathname();
  const onLight = lightHeaderPaths.has(pathname);
  const estimateActive = pathname === "/estimate";
  return <header className={`header ${onLight ? "header--light" : ""}`}><div className="header__inner">
    <Link href="/" className="logo" onClick={() => setOpen(false)}><Mark size="nav" priority /></Link>
    <button className="menu" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    <nav className={open ? "nav nav--open" : "nav"} aria-label="Main navigation">
      {nav.map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link className={`nav__cta${estimateActive ? " active" : ""}`} href={ESTIMATE_HREF} onClick={() => setOpen(false)}>Request an Estimate</Link>
    </nav>
  </div></header>;
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
  return <footer className="footer"><div className="footer__top wrap"><Mark size="footer" /><div><p className="eyebrow">METAL EXTERIORS &amp; BUILDINGS • WESTERN PENNSYLVANIA</p><p>Serving Greater Pittsburgh, Cranberry Township, Butler County, Mercer County, and Erie County.</p><p className="footer__contact"><a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a><a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a></p><nav className="footer__links" aria-label="Footer service links"><Link href="/metal-roofing">Metal Roofing</Link><Link href="/metal-siding">Metal Siding</Link><Link href="/buildings">Buildings</Link><Link href="/pole-buildings">Pole Buildings</Link><Link href="/commercial">Commercial Exteriors</Link><Link href="/service-areas">Service Areas</Link><Link href="/projects">Projects</Link><Link href={CONTACT_HREF}>Contact</Link></nav></div><Link className="arrow-link" href={ESTIMATE_HREF}>START A PROJECT <span>↗</span></Link></div>
    <div className="footer__bottom wrap"><p>© {new Date().getFullYear()} {LEGAL_NAME}</p><p>PA Registered & Fully Insured · PA HIC #PA223621</p><p>Built around the project.</p></div></footer>;
}
