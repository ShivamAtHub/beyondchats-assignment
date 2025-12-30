const axios = require("axios");

const GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1";

// Domains to exclude from search results
const BLOCKED_DOMAINS = [
  "reddit.com",
  "medium.com",
  "amazon.",
  "quora.com",
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "weforum.org",
];

// Search for related articles using Google Custom Search
async function searchRelatedArticles(query) {
  try {
    const response = await axios.get(GOOGLE_SEARCH_URL, {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID,
        q: query,
        num: 5, // fetch more, filter later
      },
    });

    const items = response.data.items || [];

    // Filter out BeyondChats links and blocked domains
    const externalLinks = items
      .map(item => item.link)
      .filter(link =>
        link &&
        (link.startsWith("http://") || link.startsWith("https://")) &&
        !link.includes("beyondchats.com") &&
        !BLOCKED_DOMAINS.some(domain => link.includes(domain))
      )
      .slice(0, 2);

    return externalLinks;
  } catch (error) {
    console.error("Google Search API error:", error.message);
    return [];
  }
}

module.exports = {
  searchRelatedArticles,
};
