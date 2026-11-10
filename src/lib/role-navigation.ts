export type BrandTrailRole = "manager" | "creator" | "reviewer";

export type NavigationItem = {
  label: string;
  path: string;
  icon: "dashboard" | "knowledge" | "new" | "submissions" | "review" | "evidence" | "impact" | "insights";
};

const sharedItems: NavigationItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Knowledge Hub", path: "/knowledge-hub", icon: "knowledge" },
];

const creatorItems: NavigationItem[] = [
  { label: "New Submission", path: "/new-submission", icon: "new" },
  { label: "My Submissions", path: "/my-submissions", icon: "submissions" },
];

const reviewerItems: NavigationItem[] = [
  { label: "Review Centre", path: "/review-centre", icon: "review" },
];

const governanceItems: NavigationItem[] = [
  { label: "Evidence Ledger", path: "/evidence-ledger", icon: "evidence" },
  { label: "Change Impact", path: "/change-impact", icon: "impact" },
  { label: "Guideline Insights", path: "/guideline-insights", icon: "insights" },
];

export function getRoleNavigation(role: string): NavigationItem[] {
  return [
    ...sharedItems,
    ...(role === "creator" ? creatorItems : []),
    ...(role === "reviewer" ? reviewerItems : []),
    ...(role === "manager" || role === "reviewer" ? governanceItems : []),
  ];
}

export function isBrandTrailRole(role: string): role is BrandTrailRole {
  return role === "manager" || role === "creator" || role === "reviewer";
}