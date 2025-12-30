# BeyondChats – Content Management & Article Rewriting System

BeyondChats is a full-stack content management system that scrapes articles from beyondchats.com, stores them in a database, and improves them using AI-assisted rewriting based on competitor content.

This project focuses on clean architecture, reliable web scraping, intelligent content enhancement, and a modern, responsive UI built with React and Tailwind CSS.

## FEATURES

- Automated scraping of BeyondChats blog articles
- Storage of original and rewritten content in MySQL
- AI-based article rewriting using Google Gemini
- Competitor article discovery via Google Custom Search
- Simple React UI to compare original vs updated content

## TECH STACK

**Backend:** Node.js, Express.js, MySQL, Axios, Cheerio  
**AI & Search:** Google Gemini API, Google Custom Search API  
**Frontend:** React, Vite, Tailwind CSS, shadcn/ui

## PROJECT STRUCTURE

```
backend/
- config/        – Database configuration  
- models/        – Database queries  
- services/      – Scraping, search, and AI logic  
- scripts/       – Phase-based workflows  
- routes/        – REST API routes  

frontend/
- components/    – UI components  
- services/      – API client  
- pages/         – Screens
```

> The project follows a clear separation of:  
> - Backend handles scraping, AI processing, and data persistence  
> - Frontend focuses on presentation and user interaction  
> - Scripts are organized for sequential workflow (scrape → update)

**Design decision:**

This is a content management system with a two-phase workflow. The architecture separates data collection (scraping), content enhancement (AI rewriting), and presentation (React UI) to maintain clarity and allow independent scaling of each component.

## HOW IT WORKS

### Phase 1: Article Scraping
1. The `scrapeBlogs.js` script identifies the last page of articles on beyondchats.com
2. Collects links from the oldest articles (starting from the last page)
3. Scrapes each article's title and content using Cheerio
4. Stores articles in MySQL database with original content

### Phase 2: Article Rewriting
1. The `updateArticles.js` script processes articles that haven't been updated
2. For each article, searches Google Custom Search for related competitor articles
3. Scrapes content from competitor articles
4. Sends original content + competitor content to Google Gemini AI
5. Gemini rewrites the article with improved clarity and depth
6. Stores updated content and reference links in the database

### Frontend
- Displays all articles
- Allows comparison of original and rewritten content
- Shows reference links for rewritten articles

## PREREQUISITES

- Node.js (v20 or higher recommended)
- npm
- MySQL database
- Google Custom Search API key and CSE ID
- Google Gemini API key

## SETUP

### 1. Clone the Repository

```bash
git clone https://github.com/ShivamAtHub/beyondchats-assignment.git
cd beyondchats_part
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
GOOGLE_API_KEY=your_google_search_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id
LLM_API_KEY=your_gemini_api_key
```

### 3. Database Setup

Create a MySQL database and run the following SQL to create the articles table:

```sql
CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(1000),
  original_content TEXT NOT NULL,
  updated_content TEXT,
  reference_links TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

## RUNNING THE PROJECT

### Start the Backend Server

```bash
cd backend
node src/server.js
```

The server will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### Run Scraping Script (Phase 1)

```bash
cd backend
node src/scripts/scrapeBlogs.js
```

This will scrape the 5 oldest articles from beyondchats.com and save them to the database.

### Run Update Script (Phase 2)

```bash
cd backend
node src/scripts/updateArticles.js
```

This will process all articles that haven't been updated yet, find competitor articles, and rewrite them using Gemini AI.

## API ENDPOINTS

- `GET /api/articles` – Get all articles
- `GET /api/articles/:id` – Get article by ID
- `POST /api/articles` – Create new article

## SUMMARY

This project demonstrates end-to-end handling of web scraping, AI-assisted content rewriting, and full-stack application design using a modern JavaScript stack.

## AUTHOR

[GitHub](https://github.com/ShivamAtHub)  
[LinkedIn](https://www.linkedin.com/in/shivamdarekar2206/)

