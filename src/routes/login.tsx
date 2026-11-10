import { FormEvent, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Waypoints } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { brandTrailMeta } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () => brandTrailMeta("Sign in", "Sign in to your BrandTrail brand governance workspace."),
  component: LoginPage,
});

const demoAccounts = [
  { role: "Manager", email: "manager@brandtrail.demo" },
  { role: "Creator", email: "creator@brandtrail.demo" },
  { role: "Reviewer", email: "reviewer@brandtrail.demo" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (address: string, secret: string) => {
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: address, password: secret });
    setBusy(false);
    if (signInError) {
      setError(signInError.message === "Invalid login credentials"
        ? "We couldn’t sign you in. Check your email and password, or confirm the demo accounts are set up in Supabase."
        : signInError.message);
      return;
    }
    await navigate({ to: "/dashboard", replace: true });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void signIn(email.trim(), password);
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.88fr)]">
      <section className="relative hidden overflow-hidden bg-sidebar px-12 py-14 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Waypoints aria-hidden="true" className="size-5" />
          </div>
          <span className="text-xl font-semibold">BrandTrail</span>
        </div>
        <div className="relative max-w-xl pb-8">
          <div className="mb-8 flex items-center gap-3 text-sm text-sidebar-foreground/70">
            <span className="h-px w-10 bg-sidebar-primary" />
            TRUSTED CONTENT, AT EVERY STEP
          </div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.1] tracking-tight">Keep every message on-brand. Keep every claim traceable.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-sidebar-foreground/70">A shared workspace for clear guidance, confident reviews, and evidence-backed content.</p>
          <div className="mt-12 grid grid-cols-3 gap-3 border-t border-sidebar-border pt-5">
            <div><p className="text-2xl font-semibold">01</p><p className="mt-1 text-xs text-sidebar-foreground/65">Know the standard</p></div>
            <div><p className="text-2xl font-semibold">02</p><p className="mt-1 text-xs text-sidebar-foreground/65">Review with context</p></div>
            <div><p className="text-2xl font-semibold">03</p><p className="mt-1 text-xs text-sidebar-foreground/65">Trace every claim</p></div>
          </div>
        </div>
        <p className="text-xs text-sidebar-foreground/60">Brand governance for teams that care about trust.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground"><Waypoints aria-hidden="true" className="size-5" /></div>
            <span className="text-xl font-semibold text-foreground">BrandTrail</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Welcome back</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Sign in to BrandTrail</h2>
          <p className="mt-2 text-sm text-muted-foreground">Enter your account details to continue to your workspace.</p>

          <form className="mt-8 space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">Email address</label>
              <Input autoComplete="email" id="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required type="email" value={email} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
              <div className="relative">
                <Input autoComplete="current-password" className="pr-11" id="password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required type={showPassword ? "text" : "password"} value={password} />
                <Button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((value) => !value)} size="icon" type="button" variant="ghost">
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </Button>
              </div>
            </div>
            {error && <p aria-live="polite" className="text-sm text-destructive" role="alert">{error}</p>}
            <Button className="h-11 w-full" disabled={busy} type="submit">
              {busy ? "Signing in…" : "Sign in"}<ArrowRight aria-hidden="true" className="ml-auto" />
            </Button>
          </form>

          <div className="my-8 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><span>OR USE A DEMO ACCOUNT</span><span className="h-px flex-1 bg-border" /></div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <Button className="h-10" disabled={busy} key={account.role} onClick={() => void signIn(account.email, "Demo@12345")} type="button" variant="outline">
                Continue as {account.role}
              </Button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">Demo buttons use the shared demo password. Demo accounts must already exist in your Supabase project.</p>
        </div>
      </section>
    </main>
  );
}