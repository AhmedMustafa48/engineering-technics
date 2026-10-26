// Shared by the server (building the index) and the client (matching queries).
export function normalizeSearch(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.]+/g, " ")
    .trim();
}

// Every query token must appear somewhere in the haystack.
export function matchesQuery(haystack, query) {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  return tokens.every((t) => haystack.includes(t));
}
