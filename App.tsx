import React, { useState, useEffect } from 'react';
import { Header, Footer } from './components/Layout';
import { Home } from './views/Home';
import { ArticleDetail } from './views/ArticleDetail';
import { AdminDashboard } from './views/AdminDashboard';
import { ViewState, Article } from './types';
import { MOCK_ARTICLES } from './constants';
import { ArticleCard } from './components/ArticleCard'; // Reusing for Category View grid

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedArticle]);

  const handleNavigate = (view: ViewState, category?: string) => {
    if (view === ViewState.CATEGORY && category) {
      setCurrentCategory(category);
    }
    setCurrentView(view);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView(ViewState.ARTICLE);
  };

  // Category View Component (Inline for simplicity in this structure)
  const CategoryView = () => {
    const filteredArticles = currentCategory 
      ? MOCK_ARTICLES.filter(a => a.category === currentCategory)
      : MOCK_ARTICLES;

    return (
      <main className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-serif font-bold text-slate-900">{currentCategory} News</h1>
          <p className="text-gray-500 mt-2">Latest updates and stories from the world of {currentCategory}.</p>
        </div>
        
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <p className="text-xl">No articles found in this category yet.</p>
            <button 
              onClick={() => handleNavigate(ViewState.HOME)} 
              className="mt-4 text-brand-red font-bold hover:underline"
            >
              Back to Home
            </button>
          </div>
        )}
      </main>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.ADMIN:
        return <AdminDashboard />;
      case ViewState.ARTICLE:
        return selectedArticle ? <ArticleDetail article={selectedArticle} /> : <Home articles={MOCK_ARTICLES} onArticleClick={handleArticleClick} />;
      case ViewState.CATEGORY:
        return <CategoryView />;
      case ViewState.HOME:
      default:
        return <Home articles={MOCK_ARTICLES} onArticleClick={handleArticleClick} />;
    }
  };

  // If Admin, render without standard Header/Footer (Dashboard has its own sidebar)
  if (currentView === ViewState.ADMIN) {
    return (
      <div>
        {/* Simple "Exit Admin" button absolute positioned or part of dashboard */}
        <div className="fixed top-4 right-4 z-50">
           <button onClick={() => setCurrentView(ViewState.HOME)} className="bg-gray-800 text-white px-3 py-1 rounded text-xs opacity-50 hover:opacity-100">Exit Admin</button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;