import { createFileRoute } from "@tanstack/react-router";
import { KnowledgeHubPage } from "@/components/knowledge-hub-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/knowledge-hub")({
  head: () => brandTrailMeta("Knowledge Hub", "Find the shared brand facts, terms, and guidelines for your organisation."),
  component: KnowledgeHubPage,
});