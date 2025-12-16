export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  EDITOR = 'EDITOR',
  REPORTER = 'REPORTER',
  SUBSCRIBER = 'SUBSCRIBER',
  // Keeping old ones for backward compatibility if needed, mapped to new logic
  ADMIN = 'ADMIN', 
  READER = 'READER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'ACTIVE' | 'BANNED';
  joinedAt: string;
}

export interface Comment {
  id: string;
  user: string;
  content: string;
  date: string;
}

export type ArticleStatus = 'PUBLISHED' | 'DRAFT' | 'REVIEW';

export interface Article {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  content: string;
  tags: string[];
  featured?: boolean;
  breaking?: boolean; // New
  pushNotification?: boolean; // New
  status?: ArticleStatus; // New
  seoTitle?: string; // New
  seoDescription?: string; // New
  views: number;
  comments: Comment[];
}

export enum ViewState {
  HOME = 'HOME',
  CATEGORY = 'CATEGORY',
  ARTICLE = 'ARTICLE',
  ADMIN = 'ADMIN',
}

export interface StatsData {
  name: string;
  views: number;
  visitors: number;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  size: string;
}

export interface SiteSettings {
  siteTitle: string;
  logoUrl: string;
  footerText: string;
  headerAdSlot: string;
  sidebarAdSlot: string;
  menuOrder: string[];
}