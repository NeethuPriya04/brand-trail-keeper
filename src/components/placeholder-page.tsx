import { ArrowUpRight } from "lucide-react";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 md:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Workspace</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-10 flex min-h-52 flex-col items-center justify-center border-t border-border text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ArrowUpRight aria-hidden="true" className="size-5" />
        </div>
        <h2 className="mt-4 text-base font-medium text-foreground">Your {title.toLowerCase()} workspace</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">This area is ready for your team’s work.</p>
      </div>
    </section>
  );
}