// Worked out from a name: the suggested slug, and a category's icon.
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// First match wins, so specific parts come before the general "transformer".
const CATEGORY_ICONS = [
  [/tap.?chang/i, "SlidersHorizontal"],
  [/thermo|temperature/i, "Thermometer"],
  [/\bfans?\b|cooling|radiator/i, "Fan"],
  [/\boils?\b|fluid|breather/i, "Droplets"],
  [/bushing/i, "Cylinder"],
  [/insulat|paper|laminat|\bwood\b|mica/i, "Layers"],
  [/cable|wire|conductor/i, "Cable"],
  [/meter|gauge|indicator/i, "Gauge"],
  [/protect|relay|safety/i, "ShieldCheck"],
  [/circuit|fuse|switch|breaker/i, "CircuitBoard"],
  [/\btest|monitor|measur|thermal imag/i, "Activity"],
  [/tank|wheel|mount|structur/i, "Anchor"],
  [/transformer|power|energy|electric/i, "Zap"],
];

export function iconForCategory(name) {
  return CATEGORY_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? "Package";
}
