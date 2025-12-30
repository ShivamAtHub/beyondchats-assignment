const ArticleModel = require("../models/article.model");

// Create a new article
async function createArticle(req, res) {
  try {
    const { title, url, original_content } = req.body;

    if (!title || !original_content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const articleId = await ArticleModel.createArticle({
      title,
      url,
      original_content,
    });

    return res.status(201).json({
      message: "Article created successfully",
      articleId,
    });
  } catch (error) {
    console.error("Create article error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Get all articles
async function getAllArticles(req, res) {
  try {
    const articles = await ArticleModel.getAllArticles();
    return res.status(200).json(articles);
  } catch (error) {
    console.error("Get all articles error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Get a single article by ID
async function getArticleById(req, res) {
  try {
    const { id } = req.params;

    const article = await ArticleModel.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    return res.status(200).json(article);
  } catch (error) {
    console.error("Get article error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
};
