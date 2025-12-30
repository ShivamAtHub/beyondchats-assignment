const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Fetch HTML from a URL
 */
async function fetchHTML(url) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });
  return cheerio.load(data);
}

module.exports = {
  fetchHTML,
};
