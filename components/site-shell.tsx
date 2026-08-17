"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_PHONE_HREF, ESTIMATE_HREF, LEGAL_NAME } from "@/lib/seo";

const nav = [
  ["Metal Roofing", "/metal-roofing"], ["Metal Siding", "/metal-siding"],
  ["Commercial", "/commercial"], ["Projects", "/projects"], ["About", "/about"],
] as const;

export function Mark({ compact = false }: { compact?: boolean }) {
  return <span className={`brand ${compact ? "brand--compact" : ""}`} aria-label="Heritage Build Group">
    <Image className="brand__image" src={compact ? "/brand/hbg-monogram.png" : "/brand/hbg-primary.png"} width={compact ? 48 : 92} height={compact ? 48 : 92} alt="Heritage Build Group" priority />
  </span>;
}

export function Header() {
  const [open, setOpen] = useState(false); const pathname = usePathname();
  const onLight = pathname === "/about" || pathname === "/estimate" || pathname === "/projects";
  return <header className={`header ${onLight ? "header--light" : ""}`}><div className="header__inner">
    <Link href="/" className="logo" onClick={() => setOpen(false)}><Mark /></Link>
    <button className="menu" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    <nav className={open ? "nav nav--open" : "nav"} aria-label="Main navigation">
      {nav.map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link className="nav__cta" href={ESTIMATE_HREF} onClick={() => setOpen(false)}>Request an Estimate</Link>
    </nav>
  </div></header>;
}

export function Footer() {
  return <footer className="footer"><div className="footer__top wrap"><Mark /><div><p className="eyebrow">RESIDENTIAL + COMMERCIAL • WESTERN PENNSYLVANIA</p><p>Serving Greater Pittsburgh, Cranberry Township, Butler County, and Mercer County.</p><p className="footer__contact"><a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a><a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a></p><nav className="footer__links" aria-label="Footer service links"><Link href="/metal-roofing">Metal Roofing</Link><Link href="/metal-siding">Metal Siding</Link><Link href="/commercial">Commercial Exteriors</Link><Link href="/service-areas">Service Areas</Link><Link href="/projects">Projects</Link></nav></div><Link className="arrow-link" href={ESTIMATE_HREF}>START A PROJECT <span>↗</span></Link></div>
    <div className="footer__bottom wrap"><p>© {new Date().getFullYear()} {LEGAL_NAME}</p><p>Built around the project.</p></div></footer>;
}
