import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination");
  if (!destination) {
    return Response.json({ error: "Destination is required" }, { status: 400 });
  }
  
  const prompt = `
  You are a global trade assistant.
  List all countries whose products are currently banned or restricted in ${destination}.
  Return only the country names in a clean JSON array like:
  ["Country1", "Country2", "Country3"]
  `;
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const match = text.match(/\[.*\]/s);
    const bannedCountries = match ? JSON.parse(match[0]) : [];
    return Response.json({ banned: bannedCountries });
  } catch (err) {
    console.error("Gemini error:", err.message);
    return Response.json({ error: "Failed to fetch banned countries" }, { status: 500 });
  }
}