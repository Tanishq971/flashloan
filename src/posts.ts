export interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  type: 'blog' | 'update' | 'announcement';
  createdAt: string; // ISO date string
}

export const posts: Post[] = [
  {
    id: '1',
    title: 'Building FlashLoanChain',
    content:
      'We are working on making microloans instant and affordable using Yellow Network channels. Stay tuned for updates!',
    authorName: 'Tanishq Kapoor',
    type: 'blog',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '2',
    title: 'Instant Tips Now Live!',
    content:
      'Excited to announce that you can now tip authors instantly with 1 USDC. Try the Sponsor button on any post.',
    authorName: 'Shreya Verma',
    type: 'announcement',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
  {
    id: '3',
    title: 'Community AMA This Week',
    content:
      'Join us for a live AMA where we’ll discuss how Yellow Network channels are powering microfinance globally.',
    authorName: 'Rohit Sharma',
    type: 'update',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
  },
  {
    id: '4',
    title: 'Version 0.1 Released',
    content:
      'Our first prototype of FlashLoanChain is out. Borrowers and lenders can now connect instantly off-chain.',
    authorName: 'Aarav Mehta',
    type: 'announcement',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 1 month ago
  },
];
