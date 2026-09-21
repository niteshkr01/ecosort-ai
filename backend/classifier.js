// classifier.js — server-side waste classification "AI".
// Keyword/heuristic engine. Swap the classify() body for a real ML/LLM call later
// without changing any route or frontend code.

const CATEGORIES = {
  RECYCLABLE: "Recyclable",
  ORGANIC: "Organic / Compostable",
  HAZARDOUS: "Hazardous",
  ELECTRONIC: "E-Waste",
  LANDFILL: "General / Landfill",
};

const RULES = [
  {
    category: CATEGORIES.ELECTRONIC,
    keywords: ["battery", "batteries", "phone", "mobile", "laptop", "charger", "cable", "wire",
      "bulb", "led", "electronic", "circuit", "remote", "earphone", "headphone", "adapter", "led bulb"],
    tip: "Drop this at a certified e-waste collection point or authorized dealer. Never put it in regular trash — it contains heavy metals that leach into soil.",
    reason: "Contains electronic components / metals that require specialized e-waste recycling to avoid soil and water contamination.",
  },
  {
    category: CATEGORIES.HAZARDOUS,
    keywords: ["paint", "chemical", "pesticide", "medicine", "syringe", "needle", "bleach",
      "thermometer", "mercury", "aerosol", "insecticide", "acid", "sanitizer bottle", "nail polish"],
    tip: "Take to a hazardous-waste facility or pharmacy take-back program. Do not pour down drains or mix with household trash.",
    reason: "Classified hazardous due to toxic/chemical content that can harm health and contaminate water sources if disposed of improperly.",
  },
  {
    category: CATEGORIES.ORGANIC,
    keywords: ["banana", "apple", "peel", "vegetable", "fruit", "food", "leftover", "leaf", "leaves",
      "tea bag", "coffee ground", "eggshell", "bread", "rice", "flower", "compost", "garden waste"],
    tip: "Compost it! Add to a home compost bin or municipal wet-waste collection — it breaks down into nutrient-rich soil.",
    reason: "Biodegradable organic matter that decomposes naturally and is ideal for composting rather than landfill.",
  },
  {
    category: CATEGORIES.RECYCLABLE,
    keywords: ["plastic bottle", "bottle", "paper", "newspaper", "cardboard", "carton", "can", "tin",
      "aluminium", "aluminum", "glass", "jar", "magazine", "box", "plastic bag", "pet bottle", "steel"],
    tip: "Rinse if needed and place in the recyclables bin. Flatten cardboard/cartons to save space.",
    reason: "Made of recoverable material (plastic/paper/metal/glass) that can be processed and reused in manufacturing.",
  },
];

function classify(rawItem) {
  const item = String(rawItem || "").trim().toLowerCase();
  if (!item) {
    return {
      item_name: rawItem || "",
      category: CATEGORIES.LANDFILL,
      disposal_tip: "Please describe the item so it can be classified.",
      reasoning: "No item description provided.",
      confidence: 0,
    };
  }

  let best = null;
  for (const rule of RULES) {
    for (const kw of rule.keywords) {
      if (item.includes(kw)) {
        const specificity = kw.length;
        if (!best || specificity > best.specificity) {
          best = { rule, specificity };
        }
      }
    }
  }

  if (best) {
    const confidence = Math.min(97, 78 + best.specificity);
    return {
      item_name: rawItem,
      category: best.rule.category,
      disposal_tip: best.rule.tip,
      reasoning: best.rule.reason,
      confidence,
    };
  }

  return {
    item_name: rawItem,
    category: CATEGORIES.LANDFILL,
    disposal_tip: "No clear recyclable/organic/hazardous match found — dispose of in general waste, but double-check locally if unsure.",
    reasoning: "Item description did not match known recyclable, organic, hazardous, or e-waste keyword patterns.",
    confidence: 55,
  };
}

module.exports = { classify, CATEGORIES };
