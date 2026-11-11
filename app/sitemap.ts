import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ["/", 1, "weekly"],
    ["/metal-roofing", .9, "monthly"],
    ["/shingle-roofing", .9, "monthly"],
    ["/metal-siding", .9, "monthly"],
    ["/vinyl-siding", .9, "monthly"],
    ["/fiber-cement-siding", .9, "monthly"],
    ["/barn-siding", .9, "monthly"],
    ["/window-replacement", .9, "monthly"],
    ["/door-replacement", .9, "monthly"],
    ["/garage-doors", .9, "monthly"],
    ["/pole-buildings", .9, "monthly"],
    ["/garages", .9, "monthly"],
    ["/buildings", .8, "monthly"],
    ["/additions", .8, "monthly"],
    ["/commercial", .8, "monthly"],
    ["/service-areas", .8, "monthly"],
    ["/service-areas/pittsburgh-pa", .8, "monthly"],
    ["/service-areas/cranberry-township-pa", .7, "monthly"],
    ["/service-areas/butler-county-pa", .7, "monthly"],
    ["/service-areas/mercer-county-pa", .7, "monthly"],
    ["/service-areas/erie-county-pa", .7, "monthly"],
    ["/projects", .8, "monthly"],
    ["/projects/complete-metal-exterior-transformation", .7, "monthly"],
    ["/projects/black-board-and-batten-barn", .7, "monthly"],
    ["/about", .6, "yearly"],
    ["/contact", .8, "yearly"],
    ["/estimate", .9, "monthly"],
  ] as const;
  return routes.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), lastModified: new Date(), changeFrequency, priority }));
}
