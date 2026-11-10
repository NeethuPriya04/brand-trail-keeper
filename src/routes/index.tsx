import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => brandTrailMeta("Welcome", "Open the BrandTrail workspace for trusted, on-brand content."),
  component: Index,
});

function Index() {
  return <Navigate to="/login" />;
}
