const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async getAllArticles() {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      // More specific error handling
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Cannot connect to the server. Please make sure the backend is running on port 5000.');
      }
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  async getArticleById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Cannot connect to the server. Please make sure the backend is running on port 5000.');
      }
      console.error('Error fetching article:', error);
      throw error;
    }
  },
};

