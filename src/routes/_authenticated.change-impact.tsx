import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/change-impact")({
  head: () => brandTrailMeta("Change Impact", "See which content may need review when brand facts change."),
  component: () => <PlaceholderPage title="Change Impact" description="See which content may need another look when a trusted fact changes." />,
});