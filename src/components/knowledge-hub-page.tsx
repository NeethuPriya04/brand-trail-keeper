import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  BookOpen,
  Clock3,
  FileClock,
  FilePlus2,
  History,
  Pencil,
  Search,
  ShieldCheck,
  Tags,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { categorizeFact, categorizeGuideline, categorizeTerm, matchesKnowledgeSearch } from "@/lib/knowledge-hub";

type Fact = {
  id: string;
  org_id: string;
  label: string;
  value: string;
  version: number;
  source_note: string | null;
  updated_at: string | null;
};

type Term = {
  id: string;
  forbidden_term: string;
  preferred_term: string;
  note: string | null;
};

type Guideline = {
  id: string;
  title: string;
  body: string;
  version: number;
};

type FactVersion = {
  id: string;
  fact_id: string;
  version: number;
  value: string;
  created_at: string | null;
};

type WorkspaceProfile = {
  full_name: string | null;
  role: string;
  org_id: string | null;
};

async function loadKnowledgeData(orgId: string) {
  const [factsResult, termsResult, guidelinesResult, versionsResult] = await Promise.all([
    supabase.from("brand_facts").select("id, org_id, label, value, version, source_note, updated_at").eq("org_id", orgId).order("label"),
    supabase.from("brand_terms").select("id, forbidden_term, preferred_term, note").eq("org_id", orgId).order("forbidden_term"),
    supabase.from("guidelines").select("id, title, body, version").eq("org_id", orgId).order("title"),
    supabase.from("fact_versions").select("id, fact_id, version, value, created_at").eq("org_id", orgId).order("version", { ascending: false }),
  ]);

  for (const result of [factsResult, termsResult, guidelinesResult, versionsResult]) {
    if (result.error) throw result.error;
  }

  return {
    facts: factsResult.data as Fact[],
    terms: termsResult.data as Term[],
    guidelines: guidelinesResult.data as Guideline[],
    versions: versionsResult.data as FactVersion[],
  };
}

function formatDate(date: string | null) {
  if (!date) return "Not recorded";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "Not recorded"
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(parsed);
}

function EmptyResults({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center border-y border-dashed border-border px-5 text-center">
      <Search aria-hidden="true" className="size-5 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium text-foreground">{children}</p>
      <p className="mt-1 text-sm text-muted-foreground">Try another search or category.</p>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

export function KnowledgeHubPage() {
  const [profile, setProfile] = useState<WorkspaceProfile | null>(null);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [versions, setVersions] = useState<FactVersion[]>([]);
  const [activeTab, setActiveTab] = useState("facts");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editFact, setEditFact] = useState<Fact | null>(null);
  const [historyFact, setHistoryFact] = useState<Fact | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newSource, setNewSource] = useState("");
  const [editValue, setEditValue] = useState("");

  const isManager = profile?.role.trim().toLowerCase() === "manager";

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) throw new Error("Your signed-in profile could not be confirmed.");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, role, org_id")
          .eq("id", userData.user.id)
          .maybeSingle();
        if (profileError) throw profileError;
        if (!profileData?.org_id) throw new Error("Your profile is not connected to an organisation.");
        const data = await loadKnowledgeData(profileData.org_id);
        if (!active) return;
        setProfile(profileData);
        setFacts(data.facts);
        setTerms(data.terms);
        setGuidelines(data.guidelines);
        setVersions(data.versions);
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : "The knowledge could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void initialize();
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    if (!profile?.org_id) return;
    const data = await loadKnowledgeData(profile.org_id);
    setFacts(data.facts);
    setTerms(data.terms);
    setGuidelines(data.guidelines);
    setVersions(data.versions);
  };

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError("");
    if (!isManager || !profile?.org_id || !newLabel.trim() || !newValue.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("brand_facts").insert({
        org_id: profile.org_id,
        label: newLabel.trim(),
        value: newValue.trim(),
        source_note: newSource.trim() || null,
      });
      if (error) throw error;
      await refresh();
      setAddOpen(false);
      setNewLabel("");
      setNewValue("");
      setNewSource("");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "The fact could not be added.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError("");
    if (!isManager || !profile?.org_id || !editFact || !editValue.trim()) return;
    if (editValue.trim() === editFact.value) {
      setActionError("Enter a changed value to create a new version.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("brand_facts")
        .update({ value: editValue.trim() })
        .eq("id", editFact.id)
        .eq("org_id", profile.org_id);
      if (error) throw error;
      await refresh();
      setEditFact(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "The fact could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const entries = activeTab === "facts"
    ? facts.map((fact) => ({ id: fact.id, category: categorizeFact(fact.label), values: [fact.label, fact.value, fact.source_note], item: fact }))
    : activeTab === "terms"
      ? terms.map((term) => ({ id: term.id, category: categorizeTerm(term.forbidden_term), values: [term.forbidden_term, term.preferred_term, term.note], item: term }))
      : guidelines.map((guideline) => ({ id: guideline.id, category: categorizeGuideline(guideline.title, guideline.body), values: [guideline.title, guideline.body], item: guideline }));
  const categories = [...new Set(entries.map((entry) => entry.category))].sort();
  const visibleEntries = entries.filter((entry) =>
    (category === "all" || entry.category === category) && matchesKnowledgeSearch(search, entry.values),
  );

  const changeTab = (value: string) => {
    setActiveTab(value);
    setCategory("all");
    setSearch("");
    setActionError("");
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-7 md:px-9 md:py-10">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <BookOpen aria-hidden="true" className="size-4" />
            <span>Brand governance</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Knowledge Hub</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A shared source for verified brand facts, approved language, and writing guidance.
          </p>
        </div>
        {isManager && activeTab === "facts" && (
          <Button onClick={() => { setActionError(""); setAddOpen(true); }}>
            <FilePlus2 aria-hidden="true" /> Add fact
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 border-b border-border py-5">
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
          <div><p className="text-lg font-semibold tabular-nums">{facts.length}</p><p className="text-xs text-muted-foreground">Brand facts</p></div>
        </div>
        <div className="flex items-center gap-3">
          <Tags aria-hidden="true" className="size-5 text-primary" />
          <div><p className="text-lg font-semibold tabular-nums">{terms.length}</p><p className="text-xs text-muted-foreground">Language rules</p></div>
        </div>
        <div className="flex items-center gap-3">
          <FileClock aria-hidden="true" className="size-5 text-primary" />
          <div><p className="text-lg font-semibold tabular-nums">{guidelines.length}</p><p className="text-xs text-muted-foreground">Guidelines</p></div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs aria-label="Knowledge categories" onValueChange={changeTab} value={activeTab}>
          <TabsList className="h-auto flex-wrap justify-start rounded-none bg-transparent p-0">
            <TabsTrigger className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none" value="facts">Facts <span className="ml-2 text-xs text-muted-foreground">{facts.length}</span></TabsTrigger>
            <TabsTrigger className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none" value="terms">Terminology <span className="ml-2 text-xs text-muted-foreground">{terms.length}</span></TabsTrigger>
            <TabsTrigger className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none" value="guidelines">Tone guidelines <span className="ml-2 text-xs text-muted-foreground">{guidelines.length}</span></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search knowledge" className="pl-9" onChange={(event) => setSearch(event.target.value)} placeholder="Search names, values, or notes" value={search} />
        </div>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger aria-label="Filter by category"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {!loading && !loadError && (
        <p className="mt-4 flex items-start gap-2 border-l-2 border-primary/40 pl-3 text-xs leading-5 text-muted-foreground">
          <Clock3 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          Fact status and effective dates are not stored in the connected table; those fields are shown as “Not recorded.”
        </p>
      )}

      {loadError ? (
        <div role="alert" className="mt-8 border-y border-destructive/30 py-5 text-sm text-destructive">{loadError}</div>
      ) : loading ? (
        <div aria-live="polite" className="py-12 text-sm text-muted-foreground">Loading your organisation’s knowledge…</div>
      ) : (
        <div className="mt-6">
          {actionError && <p role="alert" className="mb-4 text-sm text-destructive">{actionError}</p>}
          {visibleEntries.length === 0 ? (
            <EmptyResults>{entries.length === 0 ? "No entries have been added yet." : "No matching entries."}</EmptyResults>
          ) : activeTab === "facts" ? (
            <div className="space-y-3">
              {(visibleEntries.map((entry) => entry.item) as Fact[]).map((fact) => (
                <article className="rounded-md border border-border bg-card p-4 md:p-5" key={fact.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-foreground">{fact.label}</h2>
                        <Badge variant="secondary">{categorizeFact(fact.label)}</Badge>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">{fact.value}</p>
                      {fact.source_note && <p className="mt-2 text-xs text-muted-foreground">Source: {fact.source_note}</p>}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button aria-label={`View version history for ${fact.label}`} onClick={() => setHistoryFact(fact)} size="icon" title="Version history" variant="ghost"><History aria-hidden="true" /></Button>
                      {isManager && <Button aria-label={`Edit ${fact.label}`} onClick={() => { setActionError(""); setEditValue(fact.value); setEditFact(fact); }} size="icon" title="Edit fact" variant="ghost"><Pencil aria-hidden="true" /></Button>}
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-3 sm:grid-cols-4">
                    <Detail label="Status">Not recorded</Detail>
                    <Detail label="Effective date">Not recorded</Detail>
                    <Detail label="Last updated">{formatDate(fact.updated_at)}</Detail>
                    <Detail label="Version">v{fact.version}</Detail>
                  </dl>
                </article>
              ))}
            </div>
          ) : activeTab === "terms" ? (
            <div className="space-y-3">
              {(visibleEntries.map((entry) => entry.item) as Term[]).map((term) => (
                <article className="grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-5" key={term.id}>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-destructive">Avoid</p>
                    <p className="mt-1 break-words text-base font-semibold text-foreground">{term.forbidden_term}</p>
                  </div>
                  <div className="min-w-0 sm:border-l sm:border-border sm:pl-5">
                    <p className="text-xs font-medium text-primary">Use instead</p>
                    <p className="mt-1 break-words text-base font-semibold text-foreground">{term.preferred_term}</p>
                    {term.note && <p className="mt-1 text-sm leading-5 text-muted-foreground">{term.note}</p>}
                  </div>
                  <div className="sm:col-span-2"><Badge variant="outline">{categorizeTerm(term.forbidden_term)}</Badge></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(visibleEntries.map((entry) => entry.item) as Guideline[]).map((guideline) => (
                <article className="rounded-md border border-border bg-card p-4 md:p-5" key={guideline.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-foreground">{guideline.title}</h2>
                      <Badge variant="secondary">{categorizeGuideline(guideline.title, guideline.body)}</Badge>
                    </div>
                    <Badge variant="outline">v{guideline.version}</Badge>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{guideline.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog onOpenChange={(open) => { setAddOpen(open); if (!open) setActionError(""); }} open={addOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a brand fact</DialogTitle>
            <DialogDescription>Record a verified value and its source note for your organisation.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(event) => void handleAdd(event)}>
            <div className="space-y-2"><Label htmlFor="new-fact-label">Fact name</Label><Input autoFocus id="new-fact-label" onChange={(event) => setNewLabel(event.target.value)} required value={newLabel} /></div>
            <div className="space-y-2"><Label htmlFor="new-fact-value">Value</Label><Textarea id="new-fact-value" onChange={(event) => setNewValue(event.target.value)} required rows={3} value={newValue} /></div>
            <div className="space-y-2"><Label htmlFor="new-fact-source">Source note</Label><Input id="new-fact-source" onChange={(event) => setNewSource(event.target.value)} placeholder="Optional reference" value={newSource} /></div>
            {actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}
            <DialogFooter><Button disabled={saving} type="submit">{saving ? "Saving…" : "Save fact"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={(open) => { if (!open) { setEditFact(null); setActionError(""); } }} open={Boolean(editFact)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {editFact?.label ?? "fact"}</DialogTitle>
            <DialogDescription>Changing the value creates a new version and keeps the previous value in history.</DialogDescription>
          </DialogHeader>
          {editFact && <form className="space-y-4" onSubmit={(event) => void handleEdit(event)}>
            <div className="space-y-2"><Label htmlFor="edit-fact-value">New value</Label><Textarea autoFocus id="edit-fact-value" onChange={(event) => setEditValue(event.target.value)} required rows={4} value={editValue} /></div>
            {actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}
            <DialogFooter><Button disabled={saving} type="submit">{saving ? "Saving…" : "Save new version"}</Button></DialogFooter>
          </form>}
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={(open) => { if (!open) setHistoryFact(null); }} open={Boolean(historyFact)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Version history</DialogTitle>
            <DialogDescription>{historyFact?.label} · current version v{historyFact?.version}</DialogDescription>
          </DialogHeader>
          {historyFact && (
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <p className="text-xs font-medium text-primary">Current value · v{historyFact.version}</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{historyFact.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">Last updated {formatDate(historyFact.updated_at)}</p>
              </div>
              {versions.filter((version) => version.fact_id === historyFact.id).length === 0 ? (
                <div className="border-t border-border pt-4 text-sm text-muted-foreground">No earlier values are recorded for this fact.</div>
              ) : versions.filter((version) => version.fact_id === historyFact.id).map((version) => (
                <div className="border-t border-border pt-4" key={version.id}>
                  <p className="text-xs font-medium text-muted-foreground">Previous value · v{version.version}</p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{version.value}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Saved {formatDate(version.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}