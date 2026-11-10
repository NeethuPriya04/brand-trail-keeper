import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => brandTrailMeta("Dashboard", "A clear view of trusted content and brand governance work."),
  component: () => <PlaceholderPage title="Dashboard" description="Your team's brand governance at a glance." />,
});