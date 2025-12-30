import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

export function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await api.getAllArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load articles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
            <CardDescription className="space-y-2">
              <p>{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure the backend server is running on port 5000.
                <br />
                Run: <code className="bg-muted px-1 py-0.5 rounded">cd backend && npm start</code>
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Articles</CardTitle>
            <CardDescription>No articles found. Check back later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Articles</h2>
        <p className="text-muted-foreground">
          Browse through our collection of articles
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} to={`/article/${article.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 flex-1">
                    {article.title}
                  </CardTitle>
                  {article.updated_content && (
                    <Badge variant="secondary">Updated</Badge>
                  )}
                </div>
                {article.url && (
                  <CardDescription className="line-clamp-1">
                    {new URL(article.url).hostname}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.original_content?.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                    {article.updated_content && (
                      <span className="text-primary">Has update</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

