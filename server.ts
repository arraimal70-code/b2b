import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body limit for media/video base64 uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Process and generate content via Gemini
  app.post("/api/process-project", async (req, res) => {
    const {
      title,
      sourceType,
      sourceUrl,
      sourceText,
      fileBase64,
      fileMimeType,
      tone,
      formatsSelected,
      brandVoice,
    } = req.body;

    if (!formatsSelected || formatsSelected.length === 0) {
      return res.status(400).json({ success: false, error: "Please select at least one output format." });
    }

    try {
      console.log(`Starting generation for project "${title}" with tone "${tone}". Source: ${sourceType}`);
      
      let sourceContext = "";
      let mediaPart: any = null;

      // Prepare context based on source
      if (sourceType === 'youtube') {
        if (!sourceUrl) {
          return res.status(400).json({ success: false, error: "YouTube URL is required." });
        }
        sourceContext = `YouTube Video URL to analyze: ${sourceUrl}`;
      } else if (sourceType === 'file') {
        if (fileBase64 && fileMimeType) {
          // If it is a text-based file, decode it or pass it. If it is audio/video, create inlineData
          if (fileMimeType.startsWith('text/') || fileMimeType === 'application/json') {
            const decoded = Buffer.from(fileBase64, 'base64').toString('utf-8');
            sourceContext = `Uploaded Text Document Content:\n${decoded}`;
          } else if (fileMimeType.startsWith('audio/') || fileMimeType.startsWith('video/')) {
            mediaPart = {
              inlineData: {
                mimeType: fileMimeType,
                data: fileBase64
              }
            };
            sourceContext = `Analyzed audio/video media file.`;
          } else {
            // Fallback decoding
            const decoded = Buffer.from(fileBase64, 'base64').toString('utf-8');
            sourceContext = `Uploaded Document Content:\n${decoded.slice(0, 10000)}`;
          }
        } else {
          sourceContext = sourceText || "No source text provided.";
        }
      } else {
        // paste transcript
        if (!sourceText || sourceText.trim() === '') {
          return res.status(400).json({ success: false, error: "Please paste a transcript or source text." });
        }
        sourceContext = sourceText;
      }

      // Format requested formats block
      const formatsDescription = formatsSelected.map((f: string) => {
        switch (f) {
          case 'LinkedIn Post':
            return `- LinkedIn Post: Engaging hook, actionable insights with bullet points relevant to Indian business/professionals, context-aware hashtags (e.g. #IndiaBusiness, #TechIndia), and a clean call-to-action. No generic fluff.`;
          case 'LinkedIn Carousel':
            return `- LinkedIn Carousel: Slide-by-slide outline (Slide 1 to Slide N). Each slide must have a 'Visual/Layout Idea' description and 'Slide Text'. Slide 1: Hook, Slide 2 to Slide N-1: Core value bites, Final Slide: Clear Call-to-action. Great for visual carousels.`;
          case 'X/Twitter Thread':
            return `- X/Twitter Thread: A series of 5 to 10 numbered tweets (e.g. 1/, 2/). Each tweet must be punchy, highly readable, strictly under 280 characters, with strong spacing. Use hooks on 1/. No hashtags on every single tweet.`;
          case 'Instagram Caption':
            return `- Instagram Caption: Bold aesthetic punchy hook, spaced lines, visual emojis relevant to Indian audiences, and call-to-action at the end with a small group of highly relevant hashtags.`;
          case 'Reels Script':
            return `- Reels Script: Complete audio and visual script. For each section, provide '[Timestamp]', '[Visual Action/Angle]', and '[Audio/Dialogue]'. Tone should be high-energy, fast-paced, suitable for standard 30-60 second Reels.`;
          case 'Blog Post':
            return `- Blog Post: A fully structured SEO-optimized blog article. Include a catchy title, a compelling introduction, clear subheadings (H2, H3), key takeaways bulleted list, and a strong conclusion.`;
          case 'Email Newsletter':
            return `- Email Newsletter: Highly engaging subject line, warm opening hook, personal storytelling, bullet points outlining key takeaways from the source video/transcript, and a single clickable call-to-action.`;
          default:
            return `- ${f}: Professional copy formatted specifically for this channel.`;
        }
      }).join('\n\n');

      // Tone & Brand Voice instruction
      let toneDirective = "";
      if (tone === 'Desi / Hinglish') {
        toneDirective = `Use a conversational 'Desi/Hinglish' style. Blend Hindi and English words naturally, just like popular Indian creators Tanmay Bhat, Sharan Hegde, or Ranveer Allahbadia. Use words like: 'dosto', 'fayda', 'bhai', 'socho mat', 'growth hacks', 'sahi hai', 'super simple', 'karo'. Keep it extremely engaging, authentic, and fun, but still convey high-value insights.`;
      } else if (tone === 'Casual & Engaging') {
        toneDirective = `Use an English conversational, highly engaging, friendly, and narrative-driven tone. Write like a warm mentor.`;
      } else if (tone === 'Formal / Educational') {
        toneDirective = `Use an educational, authoritative, value-driven, and clear tone. Break down complex topics into super simple, digestible concepts.`;
      } else if (tone === 'Corporate / B2B') {
        toneDirective = `Use a B2B, professional, strategic, and data-driven tone. Focus on Indian startup ecosystems, industry insights, and metrics.`;
      }

      let brandVoiceDirective = "";
      if (brandVoice) {
        brandVoiceDirective = `\nApply the following customized Brand Voice profile rules strictly:
        - Profile Name: ${brandVoice.name}
        - Formatting Preferences: ${brandVoice.rules || 'None specified'}
        - Vocabulary Style: ${brandVoice.vocabulary || 'None specified'}
        - Phrases to Prefer: ${brandVoice.preferredPhrases || 'None specified'}
        - Phrases to Avoid: ${brandVoice.avoidedPhrases || 'None specified'}
        - Writing Sample Tone Reference: "${brandVoice.sample || 'None specified'}"\n`;
      }

      // Structure system prompt
      const prompt = `You are ContentForge AI, an elite content repurposing specialist for Indian creators.
Your task is to take the provided source material and repurpose it into exactly the selected formats.

SOURCE MATERIAL / CONTEXT:
${sourceContext}

TONE STYLE INSTRUCTION:
${toneDirective}
${brandVoiceDirective}

FORMATS TO GENERATE:
${formatsDescription}

CRITICAL RULES:
1. Grounding: ONLY use facts, statistics, and ideas present in the source. Do NOT invent fake case studies, fictional statistics, or false credentials. If the source material lacks details, focus purely on repurposing the existing concepts creatively.
2. Structure: Output your response as a valid JSON object. The object keys MUST correspond exactly to the requested formats (e.g., "LinkedIn Post", "LinkedIn Carousel", "X/Twitter Thread", "Instagram Caption", "Reels Script", "Blog Post", "Email Newsletter"). The values MUST be the completed content in Markdown format.
3. No wrappers: Do NOT wrap the JSON in raw markdown text or codeblocks other than returning a clean JSON string or a markdown json block. Keep keys exactly matching these names:
   ${JSON.stringify(formatsSelected)}

Example JSON response structure:
{
  "LinkedIn Post": "Markdown formatted post content...",
  "X/Twitter Thread": "Markdown formatted thread content..."
}
`;

      console.log("Calling Gemini API with model: gemini-3.5-flash");
      
      const contentsParts: any[] = [];
      if (mediaPart) {
        contentsParts.push(mediaPart);
      }
      contentsParts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsParts,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini model.");
      }

      console.log("Gemini API call succeeded. Parsing JSON response.");
      let parsedOutputs: Record<string, string>;
      try {
        parsedOutputs = JSON.parse(responseText.trim());
      } catch (e) {
        console.warn("JSON parsing failed, attempting fallback parsing.", e);
        // Fallback: if Gemini returned raw text or bad JSON, we parse manually or wrap
        parsedOutputs = {};
        formatsSelected.forEach((f: string) => {
          parsedOutputs[f] = responseText;
        });
      }

      return res.json({
        success: true,
        outputs: parsedOutputs,
        rawResponse: responseText
      });

    } catch (error: any) {
      console.error("Error generating content via Gemini:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "An unexpected error occurred during AI generation. Please try again."
      });
    }
  });

  // Serve static files in production or set up Vite dev server in development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite dev server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
