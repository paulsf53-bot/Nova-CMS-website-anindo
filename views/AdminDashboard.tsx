import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  FileText, Users, Eye, MessageCircle, PenTool, Plus, Sparkles, Image as ImageIcon, 
  Settings, LayoutDashboard, LogOut, Search, Trash2, Copy, Check, X, ArrowUp, ArrowDown,
  Bold, Italic, Link as LinkIcon, Heading
} from 'lucide-react';
import { MOCK_STATS_DATA, MOCK_ARTICLES, MOCK_MEDIA, MOCK_USERS, DEFAULT_SETTINGS, CATEGORIES } from '../constants';
import { Article, User, MediaItem, SiteSettings, UserRole, ArticleStatus } from '../types';
import { generateHeadlineIdeas } from '../services/geminiService';

// --- Sub-Components ---

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const insertFormat = (tag: string) => {
    // Simple mock insertion for prototype
    const newVal = value + `<${tag}>New Text</${tag}>`;
    onChange(newVal);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex space-x-2">
        <button onClick={() => insertFormat('b')} className="p-1 hover:bg-gray-200 rounded"><Bold size={16} /></button>
        <button onClick={() => insertFormat('i')} className="p-1 hover:bg-gray-200 rounded"><Italic size={16} /></button>
        <button onClick={() => insertFormat('h2')} className="p-1 hover:bg-gray-200 rounded"><Heading size={16} /></button>
        <button onClick={() => insertFormat('a')} className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={16} /></button>
        <button onClick={() => insertFormat('img')} className="p-1 hover:bg-gray-200 rounded"><ImageIcon size={16} /></button>
      </div>
      <textarea 
        className="w-full h-64 p-4 focus:outline-none resize-none font-mono text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your story..."
      />
    </div>
  );
};

// --- Main Dashboard View ---

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'media' | 'users' | 'settings'>('dashboard');
  
  // Data State (Simulating DB)
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // --- Views ---

  const DashboardHome = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, Admin. Here is your daily overview.</p>
         </div>
         <button 
            onClick={() => {
              setEditingArticle(emptyArticle);
              setActiveTab('posts');
              setIsEditing(true);
            }} 
            className="bg-brand-red text-white px-6 py-3 rounded shadow-lg hover:bg-red-700 transition flex items-center gap-2 font-bold"
         >
            <Plus size={18} /> Write New Post
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Posts", value: articles.length, icon: FileText, color: "text-blue-600 bg-blue-100" },
          { title: "Views (Today)", value: "12.5k", icon: Eye, color: "text-green-600 bg-green-100" },
          { title: "Active Users", value: users.filter(u => u.status === 'ACTIVE').length, icon: Users, color: "text-purple-600 bg-purple-100" },
          { title: "Pending Comments", value: "48", icon: MessageCircle, color: "text-orange-600 bg-orange-100" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
             <div>
               <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
               <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
             </div>
             <div className={`p-3 rounded-full ${stat.color}`}>
               <stat.icon size={24} />
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Eye size={18} className="text-gray-400"/> Visitor Traffic (Last 7 Days)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_STATS_DATA}>
               <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D90429" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#D90429" stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
               <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  cursor={{stroke: '#D90429', strokeWidth: 1}}
               />
               <Area type="monotone" dataKey="visitors" stroke="#2B2D42" strokeWidth={2} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // --- Posts Manager ---
  const [isEditing, setIsEditing] = useState(false);
  const emptyArticle: Article = {
    id: '', title: '', content: '', category: 'Politics', author: 'Admin', publishedAt: new Date().toISOString(),
    readTime: '5 min', imageUrl: '', tags: [], views: 0, comments: [], status: 'DRAFT'
  };
  const [editingArticle, setEditingArticle] = useState<Article>(emptyArticle);
  
  // AI Helper State
  const [topicInput, setTopicInput] = useState('');
  const [aiHeadlines, setAiHeadlines] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiGenerate = async () => {
    if (!topicInput) return;
    setIsAiLoading(true);
    const results = await generateHeadlineIdeas(topicInput);
    setAiHeadlines(results);
    setIsAiLoading(false);
  };

  const handleSavePost = () => {
    if (editingArticle.id) {
       setArticles(articles.map(a => a.id === editingArticle.id ? editingArticle : a));
    } else {
       setArticles([...articles, { ...editingArticle, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setIsEditing(false);
  };

  const PostsManager = () => {
    if (isEditing) {
      // --- Create / Edit Page ---
      return (
        <div className="animate-fade-in max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{editingArticle.id ? 'Edit Post' : 'New Post'}</h2>
            <div className="flex gap-3">
               <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
               <button onClick={handleSavePost} className="bg-brand-red text-white px-6 py-2 rounded font-bold hover:bg-red-700">
                 {editingArticle.status === 'PUBLISHED' ? 'Update' : 'Publish'}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Main Column */}
            <div className="lg:col-span-2 space-y-6">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                 <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-3 text-lg focus:outline-none focus:border-brand-dark"
                    value={editingArticle.title}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setEditingArticle({...editingArticle, title: e.target.value, slug});
                    }}
                    placeholder="Enter post title"
                 />
                 <p className="text-xs text-gray-500 mt-1">Slug: <span className="font-mono bg-gray-100 px-1">{editingArticle.slug || 'auto-generated'}</span></p>
               </div>
               
               {/* AI Assistant */}
               <div className="bg-brand-light/40 p-4 rounded-lg border border-brand-light">
                 <div className="flex items-center gap-2 mb-2 text-brand-dark font-bold text-sm">
                   <Sparkles size={16} /> AI Assistant
                 </div>
                 <div className="flex gap-2">
                   <input 
                     value={topicInput} 
                     onChange={(e) => setTopicInput(e.target.value)}
                     className="flex-1 text-sm border border-gray-300 rounded px-2 focus:outline-none" 
                     placeholder="Topic for headline ideas..." 
                   />
                   <button 
                     onClick={handleAiGenerate}
                     disabled={isAiLoading}
                     className="text-xs bg-brand-dark text-white px-3 py-1 rounded hover:opacity-90"
                   >
                     {isAiLoading ? '...' : 'Generate'}
                   </button>
                 </div>
                 {aiHeadlines.length > 0 && (
                   <div className="mt-3 grid gap-1">
                     {aiHeadlines.map((h, i) => (
                       <div key={i} className="text-xs p-2 bg-white border border-gray-200 rounded cursor-pointer hover:bg-blue-50" onClick={() => setEditingArticle({...editingArticle, title: h})}>
                         {h}
                       </div>
                     ))}
                   </div>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                 <RichTextEditor value={editingArticle.content} onChange={(val) => setEditingArticle({...editingArticle, content: val})} />
               </div>

               <div className="bg-white p-6 border border-gray-200 rounded-lg">
                 <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">SEO Settings</h3>
                 <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Meta Title</label>
                      <input 
                        className="w-full border border-gray-300 rounded p-2 text-sm" 
                        value={editingArticle.seoTitle || editingArticle.title}
                        onChange={(e) => setEditingArticle({...editingArticle, seoTitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Meta Description</label>
                      <textarea 
                        className="w-full border border-gray-300 rounded p-2 text-sm h-20"
                        value={editingArticle.seoDescription || ''}
                        onChange={(e) => setEditingArticle({...editingArticle, seoDescription: e.target.value})}
                      />
                    </div>
                 </div>
               </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
               <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Publishing</h3>
                  <div className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                       <select 
                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                         value={editingArticle.status || 'DRAFT'}
                         onChange={(e) => setEditingArticle({...editingArticle, status: e.target.value as ArticleStatus})}
                       >
                         <option value="DRAFT">Draft</option>
                         <option value="REVIEW">Pending Review</option>
                         <option value="PUBLISHED">Published</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                       <select 
                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                         value={editingArticle.category}
                         onChange={(e) => setEditingArticle({...editingArticle, category: e.target.value})}
                       >
                         {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Featured Image</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition">
                     {editingArticle.imageUrl ? (
                       <div className="relative group">
                          <img src={editingArticle.imageUrl} className="w-full h-32 object-cover rounded" />
                          <button 
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); setEditingArticle({...editingArticle, imageUrl: ''})}}
                          >
                            <X size={12} />
                          </button>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center text-gray-400">
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-xs">Click or drop image</span>
                       </div>
                     )}
                  </div>
               </div>

               <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Visibility</h3>
                  <div className="space-y-3">
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={editingArticle.breaking} onChange={(e) => setEditingArticle({...editingArticle, breaking: e.target.checked})} className="rounded text-brand-red focus:ring-brand-red" />
                        <span className="text-sm">Breaking News</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={editingArticle.featured} onChange={(e) => setEditingArticle({...editingArticle, featured: e.target.checked})} className="rounded text-brand-red focus:ring-brand-red" />
                        <span className="text-sm">Featured Slider</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={editingArticle.pushNotification} onChange={(e) => setEditingArticle({...editingArticle, pushNotification: e.target.checked})} className="rounded text-brand-red focus:ring-brand-red" />
                        <span className="text-sm">Send Push Notification</span>
                     </label>
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    }
    
    // --- List Page ---
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">All Posts</h2>
          <div className="flex gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input type="text" placeholder="Search title..." className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-dark" />
             </div>
             <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none">
                <option>All Status</option>
                <option>Published</option>
                <option>Drafts</option>
             </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50 group">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 line-clamp-1">{article.title}</div>
                    {article.breaking && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded mr-1">BREAKING</span>}
                    {article.featured && <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded">FEATURED</span>}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{article.author}</td>
                  <td className="p-4"><span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full uppercase">{article.category}</span></td>
                  <td className="p-4 text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full 
                      ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                        article.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.status || 'PUBLISHED'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { setEditingArticle(article); setIsEditing(true); }}
                      className="text-gray-400 hover:text-brand-dark mr-3"
                    >
                      <PenTool size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- Media Manager ---
  const MediaManager = () => (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Media Library</h2>
        <button className="bg-brand-dark text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
           <Plus size={16} /> Upload New
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
         {media.map(item => (
           <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer">
              <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <button className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-200" title="Copy URL">
                    <Copy size={16} />
                 </button>
                 <button className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50" title="Delete">
                    <Trash2 size={16} />
                 </button>
              </div>
              <div className="absolute bottom-0 w-full bg-white/90 text-xs p-1 truncate text-center">
                {item.filename}
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  // --- User Manager ---
  const UserManager = () => (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Users & Roles</h2>
        <button className="bg-brand-dark text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
           <Plus size={16} /> Add User
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {users.map(user => (
                 <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-slate-800">{user.name}</td>
                    <td className="p-4 text-sm text-gray-600">{user.email}</td>
                    <td className="p-4">
                       <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded 
                         ${user.role === UserRole.SUPER_ADMIN ? 'bg-purple-100 text-purple-700' : 
                           user.role === UserRole.EDITOR ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                         {user.role}
                       </span>
                    </td>
                    <td className="p-4">
                       <span className={`text-xs font-bold ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                          {user.status}
                       </span>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-brand-dark hover:underline text-xs font-bold mr-3">Edit</button>
                       <button className="text-red-600 hover:underline text-xs font-bold">Ban</button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  // --- Settings Manager ---
  const SettingsManager = () => (
    <div className="animate-fade-in max-w-4xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Site Configuration</h2>
      
      <div className="space-y-8">
        {/* General */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
           <h3 className="font-bold text-lg mb-4 text-brand-dark border-b pb-2">General</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-gray-600 mb-1">Site Title</label>
                 <input className="w-full border border-gray-300 rounded p-2" value={settings.siteTitle} onChange={(e) => setSettings({...settings, siteTitle: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-600 mb-1">Logo URL</label>
                 <div className="flex gap-2">
                    <input className="w-full border border-gray-300 rounded p-2" value={settings.logoUrl} onChange={(e) => setSettings({...settings, logoUrl: e.target.value})} />
                    <button className="px-3 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"><ImageIcon size={16} /></button>
                 </div>
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-gray-600 mb-1">Footer Text</label>
                 <input className="w-full border border-gray-300 rounded p-2" value={settings.footerText} onChange={(e) => setSettings({...settings, footerText: e.target.value})} />
              </div>
           </div>
        </div>

        {/* Ads */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
           <h3 className="font-bold text-lg mb-4 text-brand-dark border-b pb-2">Ads Manager (Google AdSense)</h3>
           <div className="space-y-4">
              <div>
                 <label className="block text-sm font-bold text-gray-600 mb-1">Header Slot (HTML/JS)</label>
                 <textarea className="w-full border border-gray-300 rounded p-2 font-mono text-xs h-20" value={settings.headerAdSlot} onChange={(e) => setSettings({...settings, headerAdSlot: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-600 mb-1">Sidebar Slot (HTML/JS)</label>
                 <textarea className="w-full border border-gray-300 rounded p-2 font-mono text-xs h-20" value={settings.sidebarAdSlot} onChange={(e) => setSettings({...settings, sidebarAdSlot: e.target.value})} />
              </div>
           </div>
        </div>

        {/* Menu Builder */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
           <h3 className="font-bold text-lg mb-4 text-brand-dark border-b pb-2">Menu Builder</h3>
           <div className="space-y-2">
              {settings.menuOrder.map((item, idx) => (
                <div key={item} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                   <span className="font-bold text-sm text-gray-700">{item}</span>
                   <div className="flex gap-1">
                      <button 
                        disabled={idx === 0}
                        onClick={() => {
                           const newOrder = [...settings.menuOrder];
                           [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                           setSettings({...settings, menuOrder: newOrder});
                        }}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                         <ArrowUp size={16} />
                      </button>
                      <button 
                        disabled={idx === settings.menuOrder.length - 1}
                        onClick={() => {
                           const newOrder = [...settings.menuOrder];
                           [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                           setSettings({...settings, menuOrder: newOrder});
                        }}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                         <ArrowDown size={16} />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-50 rounded ml-2">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-400 font-bold hover:border-gray-400 hover:text-gray-600 transition">
                 + Add Menu Item
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark min-h-screen text-gray-300 flex flex-col fixed left-0 top-0 bottom-0 z-50">
        <div className="p-6">
          <h2 className="text-2xl font-black text-white font-serif tracking-tight">NOVA<span className="text-brand-red">.</span> CMS</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'posts', label: 'News Management', icon: FileText },
            { id: 'media', label: 'Media Library', icon: ImageIcon },
            { id: 'users', label: 'Users & Roles', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
             <button 
               key={item.id}
               onClick={() => { setActiveTab(item.id as any); setIsEditing(false); }}
               className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 font-medium ${activeTab === item.id ? 'bg-brand-red text-white shadow-lg transform translate-x-1' : 'hover:bg-slate-700 hover:text-white'}`}
             >
               <item.icon size={18} />
               <span>{item.label}</span>
             </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
           <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition w-full">
              <LogOut size={16} />
              <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardHome />}
        {activeTab === 'posts' && <PostsManager />}
        {activeTab === 'media' && <MediaManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
};