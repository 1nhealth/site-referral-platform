export interface KBDocument {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  date: string;
}

export interface KBCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: 'mint' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan';
  documents: KBDocument[];
  totalDocuments: number;
}

export const kbCategories: KBCategory[] = [
  {
    id: 'admin',
    name: '1nData Administration',
    description: 'Browse documentation in the 1nData Administration category',
    icon: 'Settings',
    color: 'mint',
    totalDocuments: 12,
    documents: [
      { id: 'doc-1', title: 'Configure Calendar Engine', slug: 'configure-calendar-engine', categoryId: 'admin', date: '2025-09-17' },
      { id: 'doc-2', title: 'Managing 1nData Automations Guide', slug: 'managing-automations', categoryId: 'admin', date: '2025-09-17' },
    ],
  },
  {
    id: 'study-management',
    name: 'Study Management',
    description: 'Browse documentation in the Study Management category',
    icon: 'FlaskConical',
    color: 'blue',
    totalDocuments: 8,
    documents: [
      { id: 'doc-3', title: 'Create a Custom SMS Message', slug: 'create-custom-sms', categoryId: 'study-management', date: '2025-08-22' },
    ],
  },
  {
    id: 'stage-testing',
    name: 'Stage Testing',
    description: 'Browse documentation in the Stage Testing category',
    icon: 'TestTube2',
    color: 'purple',
    totalDocuments: 6,
    documents: [
      { id: 'doc-4', title: 'How to Log In and Use the Staging Platform', slug: 'staging-login', categoryId: 'stage-testing', date: '2025-07-15' },
      { id: 'doc-5', title: 'Matching Production-Area Studies to Staging-Area Studies', slug: 'matching-studies', categoryId: 'stage-testing', date: '2025-07-10' },
    ],
  },
  {
    id: 'search-filters',
    name: 'Search & Filters',
    description: 'Browse documentation in the Search & Filters category',
    icon: 'Search',
    color: 'amber',
    totalDocuments: 5,
    documents: [
      { id: 'doc-6', title: 'What are Advanced Filters', slug: 'advanced-filters', categoryId: 'search-filters', date: '2025-06-28' },
      { id: 'doc-7', title: 'Searching and Filtering Referrals, Studies, and More in 1nData', slug: 'searching-filtering', categoryId: 'search-filters', date: '2025-06-20' },
    ],
  },
  {
    id: 'accounts-passwords',
    name: 'Accounts & Passwords',
    description: 'Browse documentation in the Accounts & Passwords category',
    icon: 'KeyRound',
    color: 'rose',
    totalDocuments: 7,
    documents: [
      { id: 'doc-8', title: 'User Invites', slug: 'user-invites', categoryId: 'accounts-passwords', date: '2025-05-14' },
      { id: 'doc-9', title: 'Accessing Your 1nData Account', slug: 'accessing-account', categoryId: 'accounts-passwords', date: '2025-05-10' },
    ],
  },
  {
    id: 'support',
    name: '1nHealth Support',
    description: 'Browse documentation in the 1nHealth Support category',
    icon: 'LifeBuoy',
    color: 'cyan',
    totalDocuments: 10,
    documents: [
      { id: 'doc-10', title: 'Referral Re-engagement Campaigns by 1nHealth', slug: 'reengagement-campaigns', categoryId: 'support', date: '2025-04-30' },
      { id: 'doc-11', title: 'Bug Ticket Process', slug: 'bug-ticket-process', categoryId: 'support', date: '2025-04-25' },
      { id: 'doc-12', title: 'Requesting 1nHealth Support', slug: 'requesting-support', categoryId: 'support', date: '2025-04-20' },
    ],
  },
];

export function searchCategories(query: string): KBCategory[] {
  const lowerQuery = query.toLowerCase();
  return kbCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(lowerQuery) ||
      cat.description.toLowerCase().includes(lowerQuery) ||
      cat.documents.some((doc) => doc.title.toLowerCase().includes(lowerQuery))
  );
}

export function getCategoryById(id: string): KBCategory | undefined {
  return kbCategories.find((cat) => cat.id === id);
}
