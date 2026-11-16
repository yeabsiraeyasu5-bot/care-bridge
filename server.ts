import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * CareBridge Ethiopia — Administrative Coordination Assistant API
 *
 * Strictly scoped to non-clinical platform guidance, request workflow explanations,
 * and non-identifiable logistics coordination summaries.
 * Clinical diagnosis, treatment protocols, medication dosing, and autonomous dispatch
 * are explicitly prohibited.
 */
app.post("/api/assistant", async (req, res) => {
  const { query, networkSummary = "" } = req.body || {};

  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Query string is required." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    res.status(200).json({
      useFallback: true,
      reason: "Demonstration mode administrative assistant active",
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are the CareBridge Ethiopia Administrative Coordination Assistant for participating healthcare institutions in East Shewa Zone, Oromia, Ethiopia.
Your role is strictly limited to administrative platform support:
1. Explaining how to use CareBridge (resource discovery, submitting facility-to-facility requests, explicit supplier confirmation, logistics tracking, and delivery acknowledgment).
2. Summarizing non-identifiable request statuses and reported inventory freshness for authorized staff.
3. Explaining governance rules (centralized oversight by the Regional Coordination Authority with decentralized facility-to-facility response).
4. Explaining blood coordination safeguards (blood type alone does not establish clinical compatibility; qualified blood bank professionals must perform cross-matching, screening, and release).

STRICT SAFETY BOUNDARIES:
- NEVER provide clinical diagnoses, treatment instructions, medication dosages, or patient management protocols.
- NEVER decide whether a patient needs blood, oxygen, or ambulance transport.
- NEVER claim to automatically reserve stock or authorize emergency dispatch.
- If a user asks a clinical or medical treatment question, politely decline and state that CareBridge is an administrative resource coordination tool and clinical decisions must be made by qualified healthcare professionals.

Current Demonstration Network Summary:
${networkSummary}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: query,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description: "Short administrative topic heading.",
            },
            answer: {
              type: Type.STRING,
              description: "Clear, factual administrative explanation or workflow summary.",
            },
            workflowSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 4 relevant platform navigation or coordination steps.",
            },
            limitationNotice: {
              type: Type.STRING,
              description: "Explicit reminder of administrative scope or clinical/verification boundaries.",
            },
          },
          required: ["topic", "answer", "workflowSteps", "limitationNotice"],
        },
      },
    });

    const text = (response.text ?? "{}").trim();
    const parsed = JSON.parse(text);
    res.json({
      useFallback: false,
      result: parsed,
    });
  } catch (error) {
    console.error("CareBridge Administrative Assistant fallback triggered:", error);
    res.status(200).json({
      useFallback: true,
      reason: error instanceof Error ? error.message : "Fallback to local administrative guide",
    });
  }
});

// Bind port 3000 immediately so cold-start health checks never time out while Vite initializes
if (process.env.NODE_ENV !== "production") {
  const viteReadyPromise = import("vite").then(({ createServer: createViteServer }) =>
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    })
  );

  app.use(async (req, res, next) => {
    try {
      const vite = await viteReadyPromise;
      vite.middlewares(req, res, next);
    } catch (err) {
      next(err);
    }
  });
} else {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CareBridge Ethiopia server running on http://localhost:${PORT}`);
});
