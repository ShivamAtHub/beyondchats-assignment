require("dotenv").config();
const { rewriteArticle } = require("../services/llm.service");

(async () => {
  const output = await rewriteArticle({
    originalContent: "Chatbots are software programs used to automate conversations.",
    competitorContents: [
      "Chatbots use AI and NLP to simulate human conversation.",
      "Modern chatbots improve customer support and engagement."
    ],
  });

  console.log(output);
})();
