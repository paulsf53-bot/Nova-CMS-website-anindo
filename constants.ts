import { Article, Comment, User, UserRole, MediaItem, SiteSettings } from './types';

export const CATEGORIES = ['Politics', 'Technology', 'Sports', 'Entertainment', 'Health', 'Science'];

const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', user: 'Alice Johnson', content: 'Great insights, really enjoyed this piece.', date: '2 hours ago' },
  { id: 'c2', user: 'Mark Smith', content: 'I respectfully disagree with the second point.', date: '5 hours ago' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@nova.com', role: UserRole.SUPER_ADMIN, avatar: '', status: 'ACTIVE', joinedAt: '2023-01-01' },
  { id: 'u2', name: 'Sarah Jenkins', email: 'sarah@nova.com', role: UserRole.EDITOR, avatar: '', status: 'ACTIVE', joinedAt: '2023-02-15' },
  { id: 'u3', name: 'Marcus Boe', email: 'marcus@nova.com', role: UserRole.REPORTER, avatar: '', status: 'ACTIVE', joinedAt: '2023-03-10' },
  { id: 'u4', name: 'Spam Bot', email: 'bot@spam.com', role: UserRole.SUBSCRIBER, avatar: '', status: 'BANNED', joinedAt: '2023-10-01' },
];

export const MOCK_MEDIA: MediaItem[] = [
  { id: 'm1', url: 'https://picsum.photos/800/450?random=1', filename: 'summit-meeting.jpg', uploadedAt: '2023-10-27', size: '1.2 MB' },
  { id: 'm2', url: 'https://picsum.photos/800/450?random=2', filename: 'ai-robot.jpg', uploadedAt: '2023-10-26', size: '2.4 MB' },
  { id: 'm3', url: 'https://picsum.photos/800/450?random=3', filename: 'soccer-final.jpg', uploadedAt: '2023-10-25', size: '3.1 MB' },
  { id: 'm4', url: 'https://picsum.photos/800/450?random=4', filename: 'healthy-food.jpg', uploadedAt: '2023-10-24', size: '1.8 MB' },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'NOVA News Portal',
  logoUrl: '/logo.png',
  footerText: '© 2024 Nova News Portal. Delivering truth with integrity.',
  headerAdSlot: '<!-- Google AdSense Header -->',
  sidebarAdSlot: '<!-- Google AdSense Sidebar -->',
  menuOrder: CATEGORIES,
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: "Global Summit Reaches Historic Agreement on Climate Action",
    slug: "global-summit-climate-action",
    subtitle: "Leaders from 150 nations sign the new accord in Geneva.",
    category: 'Politics',
    author: 'Sarah Jenkins',
    publishedAt: '2023-10-27T09:00:00Z',
    readTime: '5 min read',
    imageUrl: 'https://picsum.photos/800/450?random=1',
    content: `In a landmark decision today, global leaders gathered in Geneva...`,
    tags: ['Climate', 'UN', 'Geneva', 'Politics'],
    featured: true,
    breaking: true,
    status: 'PUBLISHED',
    views: 12500,
    comments: MOCK_COMMENTS
  },
  {
    id: '2',
    title: "The Future of AI: Generative Models Transform Creative Industries",
    slug: "future-of-ai-generative-models",
    subtitle: "How artists and developers are adapting to the new wave of intelligence.",
    category: 'Technology',
    author: 'David Chen',
    publishedAt: '2023-10-26T14:30:00Z',
    readTime: '7 min read',
    imageUrl: 'https://picsum.photos/800/450?random=2',
    content: `Artificial Intelligence is no longer just a buzzword...`,
    tags: ['AI', 'Tech', 'Innovation', 'Future'],
    featured: true,
    status: 'PUBLISHED',
    views: 8900,
    comments: []
  },
  {
    id: '3',
    title: "Championship Finals: Underdogs Take the Trophy in Stunning Upset",
    slug: "championship-finals-underdogs",
    subtitle: "A last-minute goal sealed the victory for the city's beloved team.",
    category: 'Sports',
    author: 'Marcus Boe',
    publishedAt: '2023-10-27T20:15:00Z',
    readTime: '4 min read',
    imageUrl: 'https://picsum.photos/800/450?random=3',
    content: `In what sports commentators are calling the miracle of the season...`,
    tags: ['Football', 'Championship', 'Sports'],
    featured: false,
    status: 'DRAFT',
    views: 0,
    comments: MOCK_COMMENTS
  },
  {
    id: '4',
    title: "New Health Study Reveals Benefits of Mediterranean Diet",
    category: 'Health',
    author: 'Dr. Emily White',
    publishedAt: '2023-10-25T11:00:00Z',
    readTime: '6 min read',
    imageUrl: 'https://picsum.photos/800/450?random=4',
    content: `A comprehensive study following 10,000 participants...`,
    tags: ['Health', 'Diet', 'Wellness'],
    status: 'PUBLISHED',
    views: 3200,
    comments: []
  },
  {
    id: '5',
    title: "Blockbuster Movie Breaks Box Office Records Opening Weekend",
    category: 'Entertainment',
    author: 'Jessica Priest',
    publishedAt: '2023-10-28T08:00:00Z',
    readTime: '3 min read',
    imageUrl: 'https://picsum.photos/800/450?random=5',
    content: `The latest superhero installment has smashed global box office records...`,
    tags: ['Movies', 'Hollywood', 'Entertainment'],
    status: 'PUBLISHED',
    views: 67000,
    comments: []
  },
    {
    id: '6',
    title: "SpaceX Announces New Mission to Mars",
    category: 'Science',
    author: 'Alan Grant',
    publishedAt: '2023-10-29T10:00:00Z',
    readTime: '5 min read',
    imageUrl: 'https://picsum.photos/800/450?random=6',
    content: `The race to the red planet heats up as SpaceX unveils its Starship V3...`,
    tags: ['Space', 'Mars', 'Science', 'Tech'],
    status: 'PUBLISHED',
    views: 15000,
    comments: []
  }
];

export const MOCK_STATS_DATA = [
  { name: 'Mon', views: 4000, visitors: 2400 },
  { name: 'Tue', views: 3000, visitors: 1398 },
  { name: 'Wed', views: 2000, visitors: 9800 },
  { name: 'Thu', views: 2780, visitors: 3908 },
  { name: 'Fri', views: 1890, visitors: 4800 },
  { name: 'Sat', views: 2390, visitors: 3800 },
  { name: 'Sun', views: 3490, visitors: 4300 },
];