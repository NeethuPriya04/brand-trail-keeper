export function brandTrailMeta(title: string, description: string) {
  return {
    meta: [
      { title: `BrandTrail | ${title}` },
      { name: "description", content: description },
      { property: "og:title", content: `BrandTrail | ${title}` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}