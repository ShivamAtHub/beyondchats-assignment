require("dotenv").config();
const { scrapeArticleContent } = require("../services/scrape.service");

(async () => {
  const testUrl = "https://www.ibm.com/think/topics/chatbots";

  const content = await scrapeArticleContent(testUrl);

  console.log("Scraped content length:", content.length);
  console.log(content.slice(0, 500)); // preview first 500 chars
})();
