import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from "dotenv";
import { searchKnowledge } from "../data/iareKnowledge";
dotenv.config();

// ── MODE FLAGS ────────────────────────────────────────────────────────────────
const USE_LOCAL_KB = process.env.USE_LOCAL_KB?.toLowerCase() === "true";
const AI_PROVIDER  = (process.env.AI_PROVIDER || "gemini").toLowerCase(); // "gemini" | "local"

if (USE_LOCAL_KB) {
    console.log("[IARE Bot] 📚 Mode: LOCAL KNOWLEDGE BASE (AI disabled)");
} else {
    console.log(`[IARE Bot] 🤖 Mode: AI (provider=${AI_PROVIDER.toUpperCase()})`);
}

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
const IARE_SYSTEM_PROMPT = `You are the official AI assistant for IARE (Institute of Aeronautical Engineering), Hyderabad (iare.ac.in). Answer ONLY IARE-specific questions. Refuse all off-topic requests with: "I can only help with IARE-related questions. Visit https://www.iare.ac.in/ or email info@iare.ac.in."

KEY FACTS:
- Established 2000 | Dundigal, Hyderabad, Telangana 500 043
- AICTE approved, JNTUH affiliated, NAAC A++, 80% programs NBA accredited
- 6337+ students, 345 faculty (40% Ph.D), 1:19 faculty-student ratio
- NIRF top 200 nationally, top 100 in Innovation

PROGRAMS: B.Tech in CSE, CSE(AI&ML), CSE(Data Science), IT, Aeronautical, ECE, EEE, ME, Civil | M.Tech | MBA | Ph.D

PLACEMENTS: 91% placed, 17% abroad, 62+ companies/year. Microsoft, Amazon, JPMorgan, IBM, Accenture, Infosys, Wipro, TCS, Deloitte, Tech Mahindra + more. PAT Officer: Dr. M Pala Prasad Reddy | pat@iare.ac.in | 9491602701

FACILITIES: Smart AC classrooms, Central Library, Wi-Fi, Bus facility (live tracking), Sports, Cafeteria, Day Care, Women's 24x7 helpline

RESEARCH: 4 centers, 18 start-ups, Rs.1015L+ grants, SRI/TIPS/VIPs/PICS programs, SAE India competitions

CONTACT: +91-9154379624 (admissions, 8am-8pm) | info@iare.ac.in | Academic: +91-91546-78977 | iare.ac.in/appointmentform.html

RULES: Never invent fees/dates/cut-offs — direct to website. Be warm and encouraging. Use bullet points.`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(err: any): boolean {
    return (
        err?.status === 429 ||
        String(err?.message).includes("429") ||
        String(err?.message).toLowerCase().includes("quota") ||
        String(err?.message).toLowerCase().includes("rate")
    );
}



// ── GEMINI ────────────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const GEMINI_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
];

async function askGemini(
    message: string,
    history: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
    const geminiHistory = history.slice(-12).map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
    }));

    for (let i = 0; i < GEMINI_MODELS.length; i++) {
        const modelName = GEMINI_MODELS[i];
        try {
            console.log(`[IARE Bot] 🤖 Trying Gemini model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: IARE_SYSTEM_PROMPT,
                safetySettings,
            });
            const chat = model.startChat({ history: geminiHistory });
            const result = await chat.sendMessage(message);
            const text = result.response.text();
            if (text) {
                console.log(`[IARE Bot] ✅ Response from Gemini (${modelName})`);
                return text;
            }
        } catch (err: any) {
            if (isRateLimitError(err)) {
                console.warn(`[IARE Bot] ⚠️  Gemini ${modelName} rate-limited.${i < GEMINI_MODELS.length - 1 ? " Trying next..." : " All exhausted."}`);
                await sleep(1000);
                continue;
            }
            throw err;
        }
    }
    throw new Error("ALL_GEMINI_MODELS_RATE_LIMITED");
}

// ── LOCAL KB ──────────────────────────────────────────────────────────────────
function localResponse(message: string): { reply: string; source: "local" } {
    const localAnswer = searchKnowledge(message);
    const reply = localAnswer
        ? localAnswer
        : `I couldn't find a specific answer for that. Here's how to get help:\n\n• 🌐 Visit: https://www.iare.ac.in/\n• 📞 Call: +91 9154379624 (8 AM – 8 PM)\n• 📧 Email: info@iare.ac.in\n• 📅 Book appointment: https://iare.ac.in/appointmentform.html\n\nTry asking about: admissions, courses, placements, facilities, research, contact, or bus transport.`;
    return { reply, source: "local" };
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
/**
 * askAI — provider strategy controlled by AI_PROVIDER in .env
 *
 *  gemini → Gemini API → local KB on rate limit
 */
export async function askAI(
    message: string,
    history: { role: "user" | "assistant"; content: string }[] = []
): Promise<{ reply: string; source: "gemini" | "local" }> {

    // ── LOCAL-ONLY MODE ──────────────────────────────────────────────────────
    if (USE_LOCAL_KB || AI_PROVIDER === "local") {
        return localResponse(message);
    }

    // ── GEMINI ───────────────────────────────────────────────────────────────
    try {
        const reply = await askGemini(message, history);
        return { reply, source: "gemini" };
    } catch (err: any) {
        const allRateLimited =
            err?.message === "ALL_GEMINI_MODELS_RATE_LIMITED" || isRateLimitError(err);
        if (allRateLimited) {
            console.warn("[IARE Bot] ⚠️  All Gemini models rate-limited — using local KB.");
        } else {
            console.error("[IARE Bot] ❌ Gemini error:", err.message);
        }
    }

    // ── LOCAL KB (last resort) ───────────────────────────────────────────────
    const local = localResponse(message);
    return {
        reply: `${local.reply}\n\n---\n*ℹ️ Answering from local knowledge base (AI temporarily unavailable). Visit [iare.ac.in](https://www.iare.ac.in/) for live queries.*`,
        source: "local",
    };
}