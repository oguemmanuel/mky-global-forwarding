import type { MetadataRoute } from "next";
import { company } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? company.url;
  // Keep preview deployments out of search results
  if (process.env.NEXT_PUBLIC_PREVIEW_BANNER === "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${base}/sitemap.xml` };
}
