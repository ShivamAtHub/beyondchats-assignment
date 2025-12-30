import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react';

export function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('original');

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const data = await api.getArticleById(id);
        setArticle(data);
        setError(null);
        // Set default tab to updated if available, otherwise original
        if (data.updated_content) {
          setActiveTab('updated');
        }
      } catch (err) {
        setError(err.message || 'Failed to load article. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error || 'Article not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{article.title}</CardTitle>
              {article.url && (
                <CardDescription className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-primary"
                  >
                    {article.url}
                  </a>
                </CardDescription>
              )}
            </div>
            {article.updated_content && (
              <Badge variant="secondary">Updated Available</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
            <span>Created: {new Date(article.created_at).toLocaleString()}</span>
            {article.updated_at && (
              <span>Updated: {new Date(article.updated_at).toLocaleString()}</span>
            )}
          </div>
        </CardHeader>
      </Card>

      {article.updated_content ? (
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab('original')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'original'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Original Version
            </button>
            <button
              onClick={() => setActiveTab('updated')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'updated'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Updated Version
            </button>
          </div>

          <Card>
            <CardContent className="pt-6">
              {activeTab === 'original' ? (
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  <div className="space-y-4">
                    {article.original_content.split('\n').map((paragraph, index) => 
                      paragraph.trim() ? (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ) : null
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    <div className="space-y-4">
                      {article.updated_content.split('\n').map((paragraph, index) => 
                        paragraph.trim() ? (
                          <p key={index} className="mb-4">{paragraph}</p>
                        ) : null
                      )}
                    </div>
                  </div>
                  {article.reference_links && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="text-lg font-semibold mb-3">Reference Links</h3>
                      <div className="space-y-2">
                        {article.reference_links.split(',').map((link, index) => {
                          const trimmedLink = link.trim();
                          return trimmedLink ? (
                            <a
                              key={index}
                              href={trimmedLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-primary hover:underline flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {trimmedLink}
                            </a>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              <div className="space-y-4">
                {article.original_content.split('\n').map((paragraph, index) => 
                  paragraph.trim() ? (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ) : null
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

