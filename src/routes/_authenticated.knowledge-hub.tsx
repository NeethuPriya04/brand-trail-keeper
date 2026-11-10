import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/knowledge-hub")({
  head: () => brandTrailMeta("Knowledge Hub", "Find the shared brand facts, terms, and guidelines for your organisation."),
  component: () => <PlaceholderPage title="Knowledge Hub" description="Your organisation’s trusted facts, preferred language, and guidelines." />,
});