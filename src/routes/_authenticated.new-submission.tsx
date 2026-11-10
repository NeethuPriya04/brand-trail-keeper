import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/new-submission")({
  head: () => brandTrailMeta("New Submission", "Prepare content for a traceable, on-brand review."),
  component: () => <PlaceholderPage title="New Submission" description="Prepare content for a clear, evidence-backed review." />,
});