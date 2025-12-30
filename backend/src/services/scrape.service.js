const axios = require("axios");
const cheerio = require("cheerio");

// Scrape article content from a URL and return clean text
async function scrapeArticleContent(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html",
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const $ = cheerio.load(data);

    // Remove scripts, styles, and other non-content elements
    $("script, style, noscript, iframe").remove();

    // Try to find the main content container
    let container =
      $("article").first().length
        ? $("article").first()
        : $("main").first().length
        ? $("main").first()
        : $("body").first();

    const chunks = [];

    // Extract text from headings, paragraphs, and lists
    container.find("h1, h2, h3, p, li").each((_, el) => {
      const text = $(el).text().trim();

      // Skip short text and common footer/header content
      if (
        text.length > 40 &&
        !text.toLowerCase().includes("cookie") &&
        !text.toLowerCase().includes("privacy") &&
        !text.toLowerCase().includes("subscribe")
      ) {
        chunks.push(text);
      }
    });

    let content = chunks.join("\n\n");

    // Limit content length to avoid token limits
    if (content.length > 8000) {
      content = content.slice(0, 8000);
    }

    return content;
  } catch (error) {
    console.error(`Scrape failed for ${url}: ${error.message}`);
    return "";
  }
}

module.exports = {
  scrapeArticleContent,
};
