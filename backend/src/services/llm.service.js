const axios = require("axios");

// Rewrite article using Gemini API with competitor content as reference
async function rewriteArticle({
  originalContent,
  competitorContents,
}) {
  try {
    const prompt = `
You are a professional content editor.

TASK:
Rewrite the original article using insights from the competitor articles.

RULES:
- Keep the same topic and intent
- Improve clarity, structure, and depth
- Do NOT copy sentences verbatim
- Write in a neutral, informative tone
- Output ONLY the rewritten article text
- Do not mention competitors or sources

ORIGINAL ARTICLE:
${originalContent}

COMPETITOR ARTICLE 1:
${competitorContents[0]}

COMPETITOR ARTICLE 2:
${competitorContents[1]}
`;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.LLM_API_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    // Extract the generated text from response
    const rewritten =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return rewritten.trim();
  } catch (error) {
    console.error("Gemini rewrite failed:", error.response?.data || error.message);
    return "";
  }
}

module.exports = {
  rewriteArticle,
};
