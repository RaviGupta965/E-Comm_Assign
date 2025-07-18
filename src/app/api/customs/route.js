import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(req) {
    try {
        const { destination, productName, originCountry } = await req.json();
        
        if (!destination || !productName || !originCountry) {
            return Response.json(
                { error: "destination, productName, and originCountry are required" },
                { status: 400 }
            );
        }
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
You are a global trade and customs expert.
What is the average import/customs duty (percentage or flat rate) imposed by ${destination} on importing a product like "${productName}" from ${originCountry}?
Give only the percentage or amount (e.g., "10%" or "$25"). If unavailable, say "Not Available".
    `;

        const result = await model.generateContent(prompt);
        const customsDuty = result.response.text().trim();

        return Response.json({ customsDuty });
    } catch (err) {
        console.error("Gemini error:", err);
        return Response.json(
            { error: "Failed to fetch customs duty information" },
            { status: 500 }
        );
    }
}