import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/my-submissions")({
  head: () => brandTrailMeta("My Submissions", "Track your submitted content and its review status."),
  component: () => <PlaceholderPage title="My Submissions" description="Track your content and follow each submission through review." />,
});