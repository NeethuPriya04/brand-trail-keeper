import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { getRoleNavigation } from "@/lib/role-navigation";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("shows the manager workspace items and excludes creator-only items", () => {
    const paths = getRoleNavigation("manager").map((item) => item.path);
    expect(paths).toEqual([
      "/dashboard",
      "/knowledge-hub",
      "/evidence-ledger",
      "/change-impact",
      "/guideline-insights",
    ]);
  });

  it("shows creator submission items without review or governance items", () => {
    const paths = getRoleNavigation("creator").map((item) => item.path);
    expect(paths).toEqual([
      "/dashboard",
      "/knowledge-hub",
      "/new-submission",
      "/my-submissions",
    ]);
  });

  it("shows reviewer items with the shared governance pages", () => {
    const paths = getRoleNavigation("reviewer").map((item) => item.path);
    expect(paths).toEqual([
      "/dashboard",
      "/knowledge-hub",
      "/review-centre",
      "/evidence-ledger",
      "/change-impact",
      "/guideline-insights",
    ]);
  });
});
