export const CATEGORY_COLORS = {
  "Recyclable": "#2563eb",
  "Organic / Compostable": "#65a30d",
  "Hazardous": "#dc2626",
  "E-Waste": "#7c3aed",
  "General / Landfill": "#6b7280",
};

export function colorFor(category) {
  return CATEGORY_COLORS[category] || "#16a34a";
}
