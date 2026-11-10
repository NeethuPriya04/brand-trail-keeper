import { describe, expect, it } from "vitest";

import { categorizeFact, categorizeTerm, matchesKnowledgeSearch } from "@/lib/knowledge-hub";

describe("Knowledge Hub categories and search", () => {
  it("groups price and product-claim facts for category filtering", () => {
    expect(categorizeFact("Glow Serum price")).toBe("Pricing");
    expect(categorizeFact("Glow Serum efficacy claim")).toBe("Product claims");
  });

  it("groups the banned terms cure and guaranteed as health claims", () => {
    expect(categorizeTerm("cure")).toBe("Health claims");
    expect(categorizeTerm("guaranteed")).toBe("Health claims");
  });

  it("searches values without case sensitivity", () => {
    expect(matchesKnowledgeSearch("INR 999", ["Glow Serum price", "INR 999"])).toBe(true);
  });
});