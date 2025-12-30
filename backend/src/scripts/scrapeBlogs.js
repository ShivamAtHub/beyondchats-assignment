const axios = require("axios");
const cheerio = require("cheerio");
const ArticleModel = require("../models/article.model");

const BASE_URL = "https://beyondchats.com/blogs";

// Find the last page that has articles
async function findLastPage() {
  const MAX_PAGES = 30;
  let lastValidPage = 1;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url =
      page === 1
        ? `${BASE_URL}/`
        : `${BASE_URL}/page/${page}/`;

    try {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 8000,
      });

      const $ = cheerio.load(data);
      const articleCount = $("article").length;

      if (articleCount === 0) break;

      lastValidPage = page;
      console.log(`✔ Page ${page} valid (${articleCount} articles)`);
    } catch {
      break;
    }
  }

  return lastValidPage;
}

// Get article links from a specific page
async function getArticleLinksFromPage(pageNumber) {
  const url =
    pageNumber === 1
      ? `${BASE_URL}/`
      : `${BASE_URL}/page/${pageNumber}/`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);
  const links = [];

  // Get links from article cards, skip tag pages
  $("article.entry-card h2.entry-title a").each((_, el) => {
    const href = $(el).attr("href");
    if (href && href.includes("/blogs/") && !href.includes("/tag/") && !href.includes("/page/")) {
      links.push(href);
    }
  });

  // Reverse so we get oldest articles first
  return [...new Set(links)].reverse();
}

// Scrape content from a single article page
async function scrapeArticle(url) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    },
    timeout: 15000,
  });

  const $ = cheerio.load(data);

  // Try different selectors to find the title
  let title = $("h1.entry-title").first().text().trim();
  if (!title) {
    title = $("h1").first().text().trim();
  }
  if (!title) {
    title = $(".entry-title").first().text().trim();
  }

  let content = "";

  // Try different selectors to find the main content
  let container = $(".post-content").first();
  if (!container.length) {
    container = $(".entry-content").first();
  }
  if (!container.length) {
    const main = $("main").first();
    if (main.length) {
      container = main.find("article").first();
      if (!container.length) {
        container = main;
      }
    }
  }
  if (!container.length) {
    container = $("article").first();
  }

  if (!container.length || !title) {
    console.log(`  Warning: No content or title found for: ${url}`);
    return { title: title || "", url, original_content: "" };
  }

  // Remove scripts, styles, and other non-content elements
  container
    .find(
      "script, style, noscript, iframe, .author-box, .post-tags, .comments-area, .post-navigation, .related-posts, .sidebar, aside, nav, header, footer, .social-share"
    )
    .remove();

  // Extract text from paragraphs, headings, and lists
  const chunks = [];
  container.find("p, h2, h3, h4, li, blockquote").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 20) {
      chunks.push(text);
    }
  });

  // Fallback to full text if no chunks found
  if (chunks.length === 0) {
    content = container.text();
  } else {
    content = chunks.join("\n\n");
  }

  // Clean up the text
  content = content
    .replace(/\s+/g, " ")
    .replace(/Read more.*/gi, "")
    .replace(/Share this.*/gi, "")
    .replace(/Facebook.*/gi, "")
    .replace(/WhatsApp.*/gi, "")
    .replace(/LinkedIn.*/gi, "")
    .trim();

  return {
    title,
    url,
    original_content: content,
  };
}




// Main scraping function
async function scrapeBlogs() {
  try {
    console.log("\nDetecting last blog page...\n");
    const lastPage = await findLastPage();
    console.log(`Last page found: ${lastPage}\n`);

    let collectedLinks = [];
    let currentPage = lastPage;

    // Collect links from oldest pages first
    while (currentPage > 0 && collectedLinks.length < 5) {
      console.log(`Collecting from page ${currentPage}...`);

      const pageLinks = await getArticleLinksFromPage(currentPage);
      collectedLinks.push(...pageLinks);

      collectedLinks = [...new Set(collectedLinks)];
      currentPage--;
    }

    const oldestFive = collectedLinks.slice(0, 5);

    console.log(`\nScraping ${oldestFive.length} oldest articles...\n`);

    for (const link of oldestFive) {
      console.log(`Scraping: ${link}`);
      const article = await scrapeArticle(link);

      console.log(`  Title: ${article.title || "(empty)"}`);
      console.log(`  Content length: ${article.original_content.length} chars`);

      if (!article.title || article.original_content.length < 150) {
        console.log(`  Skipped invalid article: ${link}`);
        if (!article.title) {
          console.log(`    Reason: Missing title`);
        }
        if (article.original_content.length < 150) {
          console.log(`    Reason: Content too short (${article.original_content.length} chars)`);
        }
        continue;
      }

      await ArticleModel.createArticle(article);
      console.log(`  Saved: ${article.title}`);
    }

    console.log("\nScraping completed successfully\n");
    process.exit(0);
  } catch (error) {
    console.error("\nError: Scraping failed:", error.message);
    process.exit(1);
  }
}

scrapeBlogs();
