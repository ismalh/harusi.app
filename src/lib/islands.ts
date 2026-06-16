export const ISLANDS = [
  { value: "grande_comore", label: "Ngazidja (Grande Comore)" },
  { value: "anjouan", label: "Ndzouani (Anjouan)" },
  { value: "moheli", label: "Mwali (Mohéli)" },
  { value: "mayotte", label: "Mayotte" },
] as const;

export type IslandValue = (typeof ISLANDS)[number]["value"];

export function islandLabel(v: string | null | undefined): string {
  if (!v) return "—";
  return ISLANDS.find((i) => i.value === v)?.label ?? v;
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Refusé",
  suspended: "Suspendu",
  banned: "Banni",
};
