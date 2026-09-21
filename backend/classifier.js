// classifier.js
// Groq-powered AI waste classification
// Supports both text and image classification.

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const CATEGORIES = {
  RECYCLABLE: "Recyclable",
  ORGANIC: "Organic / Compostable",
  HAZARDOUS: "Hazardous",
  ELECTRONIC: "E-Waste",
  LANDFILL: "General / Landfill",
};

const MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

const SYSTEM_PROMPT = `
You are EcoSort AI, an expert AI waste segregation assistant.

Your task is to identify waste and classify it into EXACTLY ONE of these categories:

1. Recyclable
2. Organic / Compostable
3. Hazardous
4. E-Waste
5. General / Landfill

CLASSIFICATION RULES:

- Recyclable:
  Clean paper, cardboard, suitable plastic containers, glass bottles/jars,
  aluminium cans, steel cans and other commonly recyclable packaging.

- Organic / Compostable:
  Food scraps, fruit, vegetables, peels, leaves, flowers, garden waste,
  coffee grounds and other biodegradable organic material.

- E-Waste:
  Phones, laptops, chargers, cables, batteries, bulbs, electronic devices,
  circuit boards, earphones, adapters, remotes and other electronic items.

- Hazardous:
  Paint, pesticides, chemicals, medicines, syringes, needles, mercury,
  bleach, strong cleaning chemicals and other toxic or dangerous materials.

- General / Landfill:
  Items that do not clearly belong to the other four categories.

IMAGE ANALYSIS:

- Carefully inspect the visible object.
- Identify the main waste item.
- Do not use the image filename as the item name.
- If multiple objects are visible, identify the main/most prominent waste item.
- If the image is unclear, reduce confidence.
- Never claim certainty when the object cannot be identified reliably.

Return ONLY a valid JSON object with exactly these fields:

{
  "item_name": "specific name of the identified waste item",
  "category": "one exact category from the list",
  "disposal_tip": "specific practical disposal instruction for this exact item",
  "reasoning": "short explanation based on the identified material/object",
  "confidence": number
}

IMPORTANT FOR item_name:
- Identify the actual object.
- Use a simple, specific name.
- Examples:
  "Banana Peel"
  "Plastic Water Bottle"
  "Alkaline Battery"
  "Cardboard Box"
  "Glass Jar"
  "LED Bulb"
  "Newspaper"
- NEVER use "Waste item from uploaded image" if the object can be identified.

CONFIDENCE:
- Must be a number from 0 to 100.
- Use high confidence only when the item is clear.
- Use lower confidence when the image or description is ambiguous.

DISPOSAL TIP:
- Make the recommendation specific to the identified item.
- Do NOT give generic advice.
- Do not mention cardboard when the item is a plastic bottle.
- Do not mention composting for electronic waste.
- Do not suggest ordinary recycling for hazardous or electronic waste.

Keep the response concise and practical.
`;

async function classify(rawItem, imageData = null) {
  const item = String(rawItem || "").trim();

  if (!item && !imageData) {
    return {
      item_name: "",
      category: CATEGORIES.LANDFILL,
      disposal_tip: "Please describe the waste item or upload an image.",
      reasoning: "No waste description or image was provided.",
      confidence: 0,
    };
  }

  try {
    let userContent;

    // Image + optional text
    if (imageData) {
      userContent = [
        {
          type: "text",
          text: item
            ? `Identify and classify this waste item. The user also described it as: "${item}"`
            : "Identify the main waste item visible in this image and classify it.",
        },
        {
          type: "image_url",
          image_url: {
            url: imageData,
          },
        },
      ];
    } else {
      // Text-only classification
      userContent = item;
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.1,
      max_completion_tokens: 500,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const content =
      completion.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Groq returned an empty response");
    }

    // Remove accidental markdown code fences.
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleaned);

    const allowedCategories = Object.values(CATEGORIES);

    if (!allowedCategories.includes(result.category)) {
      throw new Error(
        `Invalid category returned by Groq: ${result.category}`
      );
    }

    const confidenceNumber = Number(result.confidence);

    const confidence = Math.max(
      0,
      Math.min(
        100,
        Number.isFinite(confidenceNumber)
          ? confidenceNumber
          : 0
      )
    );

    return {
      item_name:
        result.item_name ||
        result.itemName ||
        result.detected_item ||
        result.detectedItem ||
        (item || "Waste item from uploaded image"),

      category: result.category,

      disposal_tip: String(
        result.disposal_tip ||
        "Follow local waste disposal guidelines."
      ),

      reasoning: String(
        result.reasoning ||
        "AI analyzed the provided waste item."
      ),

      confidence,
    };
  } catch (error) {
    console.error(
      "Groq classification error:",
      error.message
    );

    // Safe fallback
    return {
      item_name:
        item ||
        "Waste item from uploaded image",

      category: CATEGORIES.LANDFILL,

      disposal_tip:
        "AI classification is temporarily unavailable. Please verify this item with your local municipal waste-management guidelines.",

      reasoning:
        "The AI classification service could not process the provided input.",

      confidence: 0,
    };
  }
}

module.exports = {
  classify,
  CATEGORIES,
};