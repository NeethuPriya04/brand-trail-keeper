import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/guideline-insights")({
  head: () => brandTrailMeta("Guideline Insights", "Review patterns and recommendations that can strengthen brand guidance."),
  component: () => <PlaceholderPage title="Guideline Insights" description="Turn recurring review patterns into stronger, clearer guidance." />,
});