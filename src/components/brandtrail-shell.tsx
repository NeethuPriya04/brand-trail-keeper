import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronLeft,
  CircleCheck,
  ClipboardList,
  FilePlus2,
  FileText,
  GitCompareArrows,
  Lightbulb,
  LogOut,
  Menu,
  PanelLeft,
  ShieldCheck,
  Waypoints,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getRoleNavigation } from "@/lib/role-navigation";

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
  org_id: string | null;
};

const iconMap = {
  dashboard: Waypoints,
  knowledge: BookOpen,
  new: FilePlus2,
  submissions: FileText,
  review: CircleCheck,
  evidence: ShieldCheck,
  impact: GitCompareArrows,
  insights: Lightbulb,
};

export function BrandTrailShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        if (active) await navigate({ to: "/login", replace: true });
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, org_id")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (!active) return;
      if (error || !data) {
        setProfileError("Your profile is not available. Please contact your organisation manager.");
        return;
      }
      setProfile(data);
      setEmail(userData.user.email ?? "");
      if (data.org_id) {
        const { data: orgData } = await supabase
          .from("organisations")
          .select("name")
          .eq("id", data.org_id)
          .maybeSingle();
        if (active) setOrganisation(orgData?.name ?? "");
      }
    };
    void loadProfile();
    return () => {
      active = false;
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  };

  const navigation = profile ? getRoleNavigation(profile.role) : [];
  const roleClass = profile?.role === "creator"
    ? "bg-role-creator/10 text-role-creator"
    : profile?.role === "reviewer"
      ? "bg-role-reviewer/10 text-role-reviewer"
      : "bg-role-manager/10 text-role-manager";

  return (
    <div className="min-h-screen bg-muted/50 md:flex">
      {mobileOpen && (
        <Button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 h-auto w-auto rounded-none bg-foreground/30 hover:bg-foreground/30 md:hidden"
          onClick={() => setMobileOpen(false)}
          variant="ghost"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 ${collapsed ? "md:w-[4.5rem]" : "md:w-64"} ${mobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0"}`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Waypoints aria-hidden="true" className="size-5" />
          </div>
          {!collapsed && <span className="text-lg font-semibold tracking-tight">BrandTrail</span>}
          <Button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex"
            onClick={() => setCollapsed((value) => !value)}
            size="icon"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            variant="ghost"
          >
            {collapsed ? <PanelLeft aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}
          </Button>
        </div>
        <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon];
            const selected = pathname === item.path;
            return (
              <Button
                aria-current={selected ? "page" : undefined}
                asChild
                className={`h-10 w-full justify-start gap-3 px-3 text-sm font-medium ${selected ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"} ${collapsed ? "md:justify-center md:px-0" : ""}`}
                key={item.path}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                variant="ghost"
              >
                <Link to={item.path} className="flex h-full w-full items-center gap-3">
                  <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </Button>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border px-4 py-4">
          {!collapsed && <p className="text-xs leading-5 text-sidebar-foreground/65">Keep every message on-brand.<br />Keep every claim traceable.</p>}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button aria-label="Open navigation" className="md:hidden" onClick={() => setMobileOpen(true)} size="icon" variant="ghost">
              <Menu aria-hidden="true" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{organisation || "BrandTrail"}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Brand governance workspace</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="max-w-48 truncate text-sm font-medium text-foreground">{profile?.full_name || email || "Loading profile"}</p>
              <p className="max-w-48 truncate text-xs text-muted-foreground">{email}</p>
            </div>
            {profile && <Badge className={`capitalize ${roleClass}`}>{profile.role}</Badge>}
            <Button aria-label="Sign out" onClick={() => void signOut()} size="icon" title="Sign out" variant="outline">
              <LogOut aria-hidden="true" />
            </Button>
          </div>
        </header>
        <main className="min-h-[calc(100vh-4rem)]">
          {profileError ? <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-destructive">{profileError}</div> : profile ? children : <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-muted-foreground">Loading your workspace…</div>}
        </main>
      </div>
    </div>
  );
}