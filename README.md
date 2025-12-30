# BeyondChats – Content Management & Article Rewriting System

BeyondChats is a full-stack web application that scrapes articles from beyondchats.com, stores them in a database, and uses AI-powered rewriting to enhance content quality using competitor articles as reference.

It is designed for content managers who want to systematically collect, store, and improve articles through intelligent rewriting using Google's Gemini AI, with insights gathered from competitor content via Google Custom Search.

This project focuses on clean architecture, reliable web scraping, intelligent content enhancement, and a modern, responsive UI built with React and Tailwind CSS.

## FEATURES

- **Automated Article Scraping** – Scrapes articles from beyondchats.com/blogs with intelligent content extraction
- **MySQL Database Storage** – Persistent storage for articles with original and updated content versions
- **AI-Powered Rewriting** – Uses Google Gemini 2.5 Flash to rewrite articles based on competitor insights
- **Competitor Research** – Automatically finds related articles using Google Custom Search API
- **Content Comparison** – View original and updated versions side-by-side with tabbed interface
- **Modern React UI** – Clean, responsive interface built with shadcn/ui and Tailwind CSS v4
- **Dark/Light Theme** – Built-in theme switching for comfortable viewing
- **Reference Links** – Tracks and displays competitor articles used for rewriting
- **Error Handling & Retries** – Robust error handling with retry logic for API calls and scraping

## TECH STACK

**Backend:**
- Node.js
- Express.js
- MySQL2
- Axios
- Cheerio (web scraping)
- Google Custom Search API
- Google Gemini AI API

**Frontend:**
- React (Hooks)
- Vite
- React Router
- Tailwind CSS v4
- shadcn/ui
- Lucide React (icons)

## PROJECT STRUCTURE

```
beyondchats_part/
├── backend/
│   ├── src/
│   │   ├── app.js                    - Express app configuration
│   │   ├── server.js                 - Server entry point
│   │   ├── config/
│   │   │   └── db.js                 - MySQL connection pool
│   │   ├── controllers/
│   │   │   └── article.controller.js - Article CRUD operations
│   │   ├── models/
│   │   │   └── article.model.js      - Database queries
│   │   ├── routes/
│   │   │   └── article.routes.js     - API route definitions
│   │   ├── services/
│   │   │   ├── scrape.service.js     - Web scraping logic
│   │   │   ├── search.service.js     - Google Search integration
│   │   │   └── llm.service.js        - Gemini AI rewriting
│   │   └── scripts/
│   │       ├── scrapeBlogs.js        - Phase 1: Scrape articles
│   │       └── updateArticles.js     - Phase 2: Rewrite articles
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx                    - Routing configuration
    │   ├── main.jsx                   - React entry point
    │   ├── index.css                  - Tailwind v4 + design tokens
    │   ├── components/
    │   │   ├── ArticleList.jsx        - Article listing page
    │   │   ├── ArticleDetail.jsx     - Article detail with tabs
    │   │   ├── Layout.jsx             - Main layout wrapper
    │   │   ├── ThemeToggle.jsx        - Theme switcher
    │   │   └── ui/                    - shadcn/ui components
    │   ├── contexts/
    │   │   └── ThemeContext.jsx       - Theme state management
    │   └── services/
    │       └── api.js                 - API client
    └── package.json
```

> The project follows a clear separation of concerns:  
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

### Frontend Display
1. React app fetches articles from the REST API
2. Article list displays all articles with status badges
3. Article detail page shows original and updated versions in tabs
4. Reference links are displayed for updated articles

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

- `GET /` – Health check
- `GET /api/articles` – Get all articles
- `GET /api/articles/:id` – Get article by ID
- `POST /api/articles` – Create new article

## SUMMARY

This project demonstrates:

- **Web Scraping** – Reliable content extraction from dynamic websites using Cheerio
- **AI Integration** – Leveraging Google Gemini for intelligent content enhancement
- **Search Integration** – Using Google Custom Search API for competitor research
- **Full-Stack Architecture** – Clean separation between backend services and frontend UI
- **Database Design** – Efficient storage of original and enhanced content versions
- **Error Handling** – Robust retry logic and error recovery for external APIs
- **Modern Frontend** – React with modern tooling (Vite, Tailwind, shadcn/ui)
- **User Experience** – Intuitive interface for comparing original and updated content

The implementation prioritizes reliability, maintainability, and user experience while handling the complexities of web scraping, AI processing, and real-world API integrations.

## AUTHOR

[GitHub](https://github.com/ShivamAtHub)  
[LinkedIn](https://www.linkedin.com/in/shivamdarekar2206/)

