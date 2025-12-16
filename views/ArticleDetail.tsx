import React, { useState } from 'react';
import { Article } from '../types';
import { Clock, Calendar, User, Share2, Sparkles } from 'lucide-react';
import { generateArticleSummary } from '../services/geminiService';

interface ArticleDetailProps {
  article: Article;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await generateArticleSummary(article.content);
    setSummary(result);
    setIsSummarizing(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Main Content */}
      <article className="lg:col-span-8">
        {/* Breadcrumb */}
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-4 font-bold">
          Home / {article.category} / <span className="text-brand-red">Current Story</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-4">
          {article.title}
        </h1>
        <h2 className="text-xl text-gray-600 font-serif leading-relaxed mb-6">
          {article.subtitle}
        </h2>

        <div className="flex items-center justify-between border-y border-gray-100 py-4 mb-8">
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <User size={20} className="text-gray-500" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900">{article.author}</p>
                   <p className="text-xs text-gray-500">Senior Editor</p>
                </div>
             </div>
             <div className="hidden sm:block h-8 w-px bg-gray-200"></div>
             <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(article.publishedAt).toDateString()}</span>
                <span className="flex items-center"><Clock size={14} className="mr-1" /> {article.readTime}</span>
             </div>
          </div>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-brand-red transition-colors">
            <Share2 size={18} />
            <span className="hidden sm:inline text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Featured Image */}
        <div className="mb-8 aspect-video w-full overflow-hidden rounded-sm bg-gray-100">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Gemini AI Summary Tool */}
        <div className="bg-brand-light/50 border border-brand-light p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-brand-dark">
              <Sparkles size={20} className="text-brand-red" />
              <h3 className="font-bold text-sm uppercase tracking-wide">AI Smart Summary</h3>
            </div>
            {!summary && (
              <button 
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="text-xs bg-white border border-gray-200 shadow-sm px-3 py-1 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                {isSummarizing ? 'Generating...' : 'Summarize with Gemini'}
              </button>
            )}
          </div>
          
          {summary && (
            <div className="mt-4 p-4 bg-white rounded border border-gray-100 text-sm text-gray-700 leading-relaxed animate-fade-in">
              <h4 className="font-bold mb-2 text-gray-900">Key Takeaways:</h4>
              <div className="prose prose-sm max-w-none whitespace-pre-line">
                {summary}
              </div>
            </div>
          )}
          {!summary && !isSummarizing && (
             <p className="text-xs text-gray-500 mt-1">Get a quick 3-point summary of this article powered by Gemini AI.</p>
          )}
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-slate-800 font-serif leading-8">
           {article.content.split('\n').map((paragraph, idx) => (
             <p key={idx} className="mb-6">{paragraph}</p>
           ))}
        </div>

        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-gray-100">
           <div className="flex flex-wrap gap-2">
             {article.tags.map(tag => (
               <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 text-sm rounded hover:bg-brand-dark hover:text-white transition-colors cursor-pointer">
                 #{tag}
               </span>
             ))}
           </div>
        </div>
      </article>

      {/* Right Sidebar - Related */}
      <aside className="lg:col-span-4 space-y-10">
        <div className="sticky top-4">
           {/* Ad */}
           <div className="w-full h-[300px] bg-gray-100 mb-8 flex items-center justify-center text-gray-400 text-sm border border-dashed">
             Related Ad
           </div>

           <h3 className="font-bold text-lg mb-4 border-l-4 border-brand-red pl-3">Related Stories</h3>
           <div className="space-y-6">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex gap-3 cursor-pointer group">
                  <div className="w-20 h-20 bg-gray-200 flex-shrink-0">
                    <img src={`https://picsum.photos/200/200?random=${20+i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="thumb"/>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm leading-snug group-hover:text-brand-red transition-colors">Economic impact of the new climate policies discussed</h4>
                    <span className="text-xs text-gray-400 mt-1 block">3 hours ago</span>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </aside>

    </main>
  );
};