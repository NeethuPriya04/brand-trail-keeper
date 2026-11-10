export function categorizeFact(label: string): string {
  const normalized = label.toLowerCase();
  if (/price|pricing|cost/.test(normalized)) return "Pricing";
  if (/promo|offer|discount|sale/.test(normalized)) return "Promotions";
  if (/claim|efficacy|benefit|serum|product/.test(normalized)) return "Product claims";
  if (/ship|delivery|threshold/.test(normalized)) return "Shipping";
  return "General";
}

export function categorizeTerm(forbiddenTerm: string): string {
  const normalized = forbiddenTerm.toLowerCase();
  if (/cure|guaranteed|miracle|heal|medical/.test(normalized)) return "Health claims";
  if (/cheap|affordable|price|cost/.test(normalized)) return "Value language";
  if (/customer|member|user/.test(normalized)) return "Audience language";
  return "Terminology";
}

export function categorizeGuideline(title: string, body: string): string {
  return /medical|claim|promise|proof|best|number one/i.test(`${title} ${body}`)
    ? "Claims & substantiation"
    : "Voice & tone";
}

export function matchesKnowledgeSearch(query: string, values: Array<string | null | undefined>): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  return !normalizedQuery || values.some((value) => value?.toLowerCase().includes(normalizedQuery));
}