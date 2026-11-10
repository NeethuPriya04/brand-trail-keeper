import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/review-centre")({
  head: () => brandTrailMeta("Review Centre", "Review content with brand guidance and evidence in view."),
  component: () => <PlaceholderPage title="Review Centre" description="Review submissions with the guidance and claim context close at hand." />,
});