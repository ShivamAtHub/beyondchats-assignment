require("dotenv").config();

const ArticleModel = require("../models/article.model");
const { searchRelatedArticles } = require("../services/search.service");
const { scrapeArticleContent } = require("../services/scrape.service");
const { rewriteArticle } = require("../services/llm.service");

// Helper function to retry an operation
async function retryOperation(operation, maxRetries = 2, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
}

// Try different search query variations if initial search fails
async function searchWithVariations(title) {
  let links = await searchRelatedArticles(title);
  
  if (links.length >= 2) {
    return links;
  }

  // Try without common words that might limit results
  const words = title.split(" ").filter(w => w.length > 3);
  if (words.length > 3) {
    const shorterQuery = words.slice(0, 3).join(" ");
    console.log(`  Trying alternative search query: "${shorterQuery}"`);
    links = await searchRelatedArticles(shorterQuery);
  }

  return links;
}

async function updateArticles() {
  try {
    console.log("\nFetching articles from database...\n");
    const articles = await ArticleModel.getAllArticles();

    if (!articles.length) {
      console.log("No articles found. Run Phase 1 first.");
      process.exit(0);
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      console.log(`\nProcessing article: ${article.title}`);
      console.log(`Article ID: ${article.id}`);

      // Skip if already updated
      if (article.updated_content) {
        console.log("Already updated, skipping");
        skipCount++;
        continue;
      }

      try {
        // Step 1: Google search with retry and variations
        console.log("Searching for related articles...");
        let links = [];
        
        try {
          links = await retryOperation(() => searchWithVariations(article.title));
        } catch (error) {
          console.log(`Search failed: ${error.message}`);
          errorCount++;
          continue;
        }

        if (links.length < 2) {
          console.log(`Only found ${links.length} reference link(s), need at least 2. Skipping.`);
          errorCount++;
          continue;
        }

        console.log(`Found ${links.length} reference links:`);
        links.forEach((l, idx) => console.log(`  ${idx + 1}. ${l}`));

        // Step 2: Scrape competitor articles with retry
        console.log("Scraping competitor articles...");
        const competitorContents = [];

        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          console.log(`  Scraping link ${i + 1}/${links.length}...`);
          
          try {
            const content = await retryOperation(() => scrapeArticleContent(link));
            
            if (content && content.length > 500) {
              competitorContents.push(content);
              console.log(`  Successfully scraped ${content.length} characters`);
            } else {
              console.log(`  Scraped content too short (${content?.length || 0} chars), skipping this link`);
            }
          } catch (error) {
            console.log(`  Failed to scrape: ${error.message}`);
            // Continue with other links
          }
        }

        if (competitorContents.length < 2) {
          console.log(`Only scraped ${competitorContents.length} article(s) successfully, need at least 2. Skipping.`);
          errorCount++;
          continue;
        }

        // Step 3: Rewrite using Gemini with retry
        console.log("Rewriting article using Gemini...");
        let updatedContent = "";
        
        try {
          updatedContent = await retryOperation(() => rewriteArticle({
            originalContent: article.original_content,
            competitorContents,
          }), 3, 2000); // More retries for LLM, longer delay
        } catch (error) {
          console.log(`Gemini rewrite failed: ${error.message}`);
          if (error.response?.data) {
            console.log(`  API Error: ${JSON.stringify(error.response.data)}`);
          }
          errorCount++;
          continue;
        }

        if (!updatedContent || updatedContent.trim().length < 100) {
          console.log(`Gemini returned invalid output (${updatedContent?.length || 0} chars). Skipping.`);
          errorCount++;
          continue;
        }

        // Step 4: Save updated content
        console.log("Saving updated article...");
        await ArticleModel.updateArticle(article.id, {
          updated_content: updatedContent,
          reference_links: links.join(", "),
        });

        console.log("Article updated successfully");
        successCount++;
      } catch (error) {
        console.log(`Unexpected error processing article: ${error.message}`);
        errorCount++;
        continue;
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("Update Summary:");
    console.log(`  Successfully updated: ${successCount}`);
    console.log(`  Skipped (already updated): ${skipCount}`);
    console.log(`  Failed/Errors: ${errorCount}`);
    console.log(`  Total processed: ${articles.length}`);
    console.log("=".repeat(50) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\nFatal error in update process:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

updateArticles();
