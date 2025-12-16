import React, { useState } from 'react';
import { Menu, Search, User, X, Facebook, Twitter, Instagram, CloudSun, Globe } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { ViewState } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewState, category?: string) => void;
  currentView: ViewState;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full bg-white shadow-sm z-50 relative font-sans">
      {/* Top Bar */}
      <div className="bg-brand-dark text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="opacity-80">{currentDate}</span>
            <span className="hidden sm:flex items-center space-x-1 opacity-80">
              <CloudSun size={14} />
              <span>24°C London</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <Facebook size={14} className="hover:text-brand-light cursor-pointer" />
              <Twitter size={14} className="hover:text-brand-light cursor-pointer" />
              <Instagram size={14} className="hover:text-brand-light cursor-pointer" />
            </div>
            <div className="h-4 w-px bg-gray-600"></div>
            <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80">
              <Globe size={14} />
              <span>English</span>
            </div>
            <div 
              className="cursor-pointer font-semibold hover:text-brand-red ml-4"
              onClick={() => onNavigate(ViewState.ADMIN)}
            >
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div 
              className="text-3xl md:text-5xl font-serif font-black tracking-tight text-slate-900 cursor-pointer flex-1 md:flex-none text-center md:text-left"
              onClick={() => onNavigate(ViewState.HOME)}
            >
              NOVA<span className="text-brand-red">.</span>
            </div>

            {/* Search & User (Desktop) */}
            <div className="hidden md:flex items-center space-x-6">
              <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-8'}`}>
                {isSearchOpen ? (
                   <div className="flex items-center">
                      <input 
                        type="text" 
                        placeholder="Search news..." 
                        className="w-full border-b border-gray-300 py-1 focus:outline-none text-sm"
                        autoFocus
                      />
                      <X size={18} className="cursor-pointer ml-2 text-gray-500" onClick={() => setIsSearchOpen(false)} />
                   </div>
                ) : (
                  <Search size={24} className="cursor-pointer text-gray-700 hover:text-brand-red" onClick={() => setIsSearchOpen(true)} />
                )}
              </div>
              <button className="bg-brand-dark text-white px-4 py-2 text-sm font-medium rounded hover:bg-slate-800 transition-colors">
                Subscribe
              </button>
            </div>
            
            {/* Mobile Search Icon */}
            <div className="md:hidden">
              <Search size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block border-b border-gray-200 bg-white`}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-8 py-3 text-sm font-bold uppercase tracking-wider text-slate-700">
            <li 
              className="cursor-pointer hover:text-brand-red py-1"
              onClick={() => {
                onNavigate(ViewState.HOME);
                setIsMenuOpen(false);
              }}
            >
              Home
            </li>
            {CATEGORIES.map((cat) => (
              <li 
                key={cat} 
                className="cursor-pointer hover:text-brand-red py-1"
                onClick={() => {
                  onNavigate(ViewState.CATEGORY, cat);
                  setIsMenuOpen(false);
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Breaking News Ticker */}
      <div className="bg-brand-red text-white text-sm font-medium py-2 overflow-hidden flex items-center relative z-40">
        <div className="bg-brand-red z-10 px-4 font-bold uppercase tracking-wide shadow-[4px_0_8px_rgba(217,4,41,1)]">
          Breaking
        </div>
        <div className="whitespace-nowrap animate-marquee flex space-x-10 pl-4">
           <span>Stocks rally as inflation data shows cooling trends.</span>
           <span className="text-red-200">•</span>
           <span>Local sports team qualifies for finals after 20 years.</span>
           <span className="text-red-200">•</span>
           <span>New tech regulations proposed by EU commission.</span>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-gray-300 py-12 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-serif font-bold text-white mb-4">NOVA.</h3>
          <p className="text-sm leading-relaxed">
            Delivering the truth with integrity. Your daily source for global news, insights, and analysis.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-4 text-sm">Sections</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">World</li>
            <li className="hover:text-white cursor-pointer">Politics</li>
            <li className="hover:text-white cursor-pointer">Business</li>
            <li className="hover:text-white cursor-pointer">Tech</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-4 text-sm">Newsletter</h4>
          <p className="text-xs mb-4">Subscribe to get the latest news delivered to your inbox.</p>
          <div className="flex">
            <input type="email" placeholder="Email address" className="bg-slate-800 border-none outline-none text-white px-3 py-2 text-sm w-full" />
            <button className="bg-brand-red text-white px-4 py-2 text-sm font-bold uppercase">Go</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-xs text-center">
        © {new Date().getFullYear()} Nova News Portal. All rights reserved.
      </div>
    </footer>
  );
};