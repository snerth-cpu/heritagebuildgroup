import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ["/", 1, "weekly"], ["/metal-roofing", .9, "monthly"], ["/metal-siding", .9, "monthly"],
    ["/commercial", .9, "monthly"], ["/service-areas", .9, "monthly"],
    ["/service-areas/pittsburgh-pa", .9, "monthly"], ["/service-areas/cranberry-township-pa", .8, "monthly"],
    ["/service-areas/butler-county-pa", .8, "monthly"], ["/service-areas/mercer-county-pa", .8, "monthly"],
    ["/projects", .8, "monthly"], ["/projects/complete-metal-exterior-transformation", .7, "monthly"],
    ["/about", .6, "yearly"], ["/estimate", .7, "yearly"],
  ] as const;
  return routes.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), lastModified: new Date(), changeFrequency, priority }));
}
