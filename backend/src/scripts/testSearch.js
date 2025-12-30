require("dotenv").config();
const { searchRelatedArticles } = require("../services/search.service");

(async () => {
  const results = await searchRelatedArticles(
    "Choosing the right AI chatbot"
  );

  console.log("Search results:", results);
})();
