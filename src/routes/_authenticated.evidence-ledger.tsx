import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/evidence-ledger")({
  head: () => brandTrailMeta("Evidence Ledger", "Trace claims to verified brand facts and their source versions."),
  component: () => <PlaceholderPage title="Evidence Ledger" description="Trace content claims to the source facts that support them." />,
});