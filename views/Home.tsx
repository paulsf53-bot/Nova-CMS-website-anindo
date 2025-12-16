import React from 'react';
import { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { PlayCircle } from 'lucide-react';

interface HomeProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export const Home: React.FC<HomeProps> = ({ articles, onArticleClick }) => {
  const featuredArticle = articles.find(a => a.featured) || articles[0];
  const secondaryFeatures = articles.filter(a => a.id !== featuredArticle.id).slice(0, 2);
  const latestNews = articles.slice(0, 6); // Just generic list for now
  const trending = articles.slice().sort((a,b) => b.views - a.views).slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 h-auto lg:h-[500px]">
          {/* Main Slider */}
          <div className="lg:col-span-8 h-[400px] lg:h-full">
            <ArticleCard article={featuredArticle} onClick={onArticleClick} variant="featured" />
          </div>
          {/* Side Highlights */}
          <div className="lg:col-span-4 flex flex-col gap-6 mt-6 lg:mt-0">
            {secondaryFeatures.map(article => (
              <div key={article.id} className="flex-1 bg-white p-4 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onArticleClick(article)}>
                <span className="text-xs font-bold text-brand-red uppercase block mb-2">{article.category}</span>
                <h3 className="font-serif font-bold text-lg leading-snug mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{article.subtitle}</p>
              </div>
            ))}
            {/* Ad Space Small */}
            <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest border border-dashed border-gray-300">
              Ad Space (300x125)
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Latest Stream */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6 border-b border-black pb-2">
              <h2 className="text-2xl font-serif font-bold text-slate-900">Latest News</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestNews.map(article => (
                <ArticleCard key={article.id} article={article} onClick={onArticleClick} variant="standard" />
              ))}
            </div>

            {/* Video Gallery Section within content */}
            <div className="mt-16 bg-brand-dark p-8 rounded-sm text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-serif">Video Gallery</h3>
                <button className="text-xs uppercase font-bold border border-white/30 px-4 py-2 hover:bg-white hover:text-brand-dark transition-colors">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="group cursor-pointer">
                      <div className="relative aspect-video bg-gray-800 mb-3 overflow-hidden">
                        <img src={`https://picsum.photos/400/225?random=${10+i}`} alt="Video thumbnail" className="opacity-70 group-hover:opacity-100 transition-opacity w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle size={48} className="text-white/90 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold leading-tight group-hover:text-gray-300">Analysis: The impact of global trade shifts</h4>
                   </div>
                 ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Ad Space Large */}
            <div className="w-full h-[250px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm uppercase tracking-widest border border-dashed border-gray-300">
              Ad Space (300x250)
            </div>

            {/* Trending */}
            <div>
              <div className="flex items-center mb-6 border-b border-gray-200">
                <h3 className="text-lg font-bold font-sans uppercase border-b-2 border-brand-red pb-2 -mb-[1px]">Trending</h3>
              </div>
              <div className="bg-white p-4 shadow-sm border border-gray-100">
                <ol className="list-decimal list-inside space-y-4">
                  {trending.map((article) => (
                    <li key={article.id} className="text-sm font-serif font-bold text-slate-800 cursor-pointer hover:text-brand-red" onClick={() => onArticleClick(article)}>
                       <span className="ml-2 font-sans font-normal text-gray-600 hover:underline">{article.title}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Categories List */}
            <div>
              <div className="flex items-center mb-6 border-b border-gray-200">
                <h3 className="text-lg font-bold font-sans uppercase border-b-2 border-brand-red pb-2 -mb-[1px]">Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Politics', 'Business', 'Tech', 'Science', 'Health', 'Travel', 'Culture'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-xs font-bold uppercase text-gray-600 hover:bg-brand-red hover:text-white cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </section>
    </main>
  );
};