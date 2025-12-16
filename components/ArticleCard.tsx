import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  variant?: 'standard' | 'compact' | 'featured';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, variant = 'standard' }) => {
  if (variant === 'featured') {
    return (
      <div className="group cursor-pointer h-full relative overflow-hidden" onClick={() => onClick(article)}>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 uppercase mb-3 inline-block">
            {article.category}
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight group-hover:text-gray-200 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-4 hidden md:block">
            {article.subtitle}
          </p>
          <div className="flex items-center text-gray-400 text-xs space-x-4">
            <span>By {article.author}</span>
            <span className="flex items-center"><Clock size={12} className="mr-1"/> {article.readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="group flex gap-4 cursor-pointer mb-6" onClick={() => onClick(article)}>
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm">
           <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-brand-red text-xs font-bold uppercase mb-1">{article.category}</span>
          <h4 className="font-serif font-bold text-slate-800 leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
            {article.title}
          </h4>
          <span className="text-gray-500 text-xs mt-2">{article.publishedAt.split('T')[0]}</span>
        </div>
      </div>
    );
  }

  // Standard
  return (
    <div className="group cursor-pointer flex flex-col h-full" onClick={() => onClick(article)}>
      <div className="overflow-hidden rounded-sm mb-4 aspect-video relative">
         <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-brand-red text-xs font-bold uppercase tracking-wider">{article.category}</span>
          <span className="text-gray-400 text-xs">{article.readTime}</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-red transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {article.content.substring(0, 150)}...
        </p>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{article.author}</span>
          <div className="flex items-center space-x-2">
            <MessageSquare size={14} />
            <span>{article.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};