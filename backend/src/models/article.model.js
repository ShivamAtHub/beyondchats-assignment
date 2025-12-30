const db = require("../config/db");

// Save a new article to the database
async function createArticle(article) {
  const { title, url, original_content } = article;

  const query = `
    INSERT INTO articles (title, url, original_content)
    VALUES (?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    title,
    url,
    original_content,
  ]);

  return result.insertId;
}

// Get all articles from the database
async function getAllArticles() {
  const query = `
    SELECT *
    FROM articles
    ORDER BY created_at DESC
  `;

  const [rows] = await db.execute(query);
  return rows;
}

// Get a single article by ID
async function getArticleById(id) {
  const query = `
    SELECT *
    FROM articles
    WHERE id = ?
  `;

  const [rows] = await db.execute(query, [id]);
  return rows[0];
}

// Update article with rewritten content and reference links
async function updateArticle(id, data) {
  const { updated_content, reference_links } = data;

  const query = `
    UPDATE articles
    SET updated_content = ?, reference_links = ?
    WHERE id = ?
  `;

  await db.execute(query, [
    updated_content,
    reference_links,
    id,
  ]);
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
};
