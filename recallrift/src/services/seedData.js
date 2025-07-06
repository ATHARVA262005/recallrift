import { memoryService, categoryService } from './database.js';

// Demo data for testing
const demoCategories = [
  { name: 'Ideas', color: '#3B82F6' },
  { name: 'Work', color: '#EF4444' },
  { name: 'Personal', color: '#10B981' },
  { name: 'Learning', color: '#F59E0B' },
  { name: 'Random Thoughts', color: '#8B5CF6' }
];

const demoMemories = [
  {
    title: 'App Idea: Local-First Note Taking',
    content: 'Been thinking about building a note-taking app that works entirely offline. Users are getting tired of cloud-dependent apps. The key would be to make sync optional and ensure the app works perfectly without internet.',
    category: 'Ideas',
    tags: ['app-development', 'offline-first', 'productivity']
  },
  {
    title: 'Meeting Notes: Q1 Planning',
    content: 'Discussed quarterly goals with the team. Focus areas: 1) User acquisition - target 10k new users, 2) Feature development - complete mobile app, 3) Performance optimization - reduce load times by 30%.',
    category: 'Work',
    tags: ['meetings', 'planning', 'q1-goals']
  },
  {
    title: 'Book Insight: Atomic Habits',
    content: 'James Clear\'s concept of "1% better every day" is powerful. Small improvements compound over time. The key is systems over goals - focus on the process, not the outcome.',
    category: 'Learning',
    tags: ['books', 'productivity', 'habits']
  },
  {
    title: 'Weekend Project Ideas',
    content: 'Some coding projects to try: 1) Build a personal dashboard with weather, news, and calendar, 2) Create a simple expense tracker, 3) Make a pomodoro timer with custom sounds.',
    category: 'Personal',
    tags: ['projects', 'coding', 'weekend']
  },
  {
    title: 'React Performance Optimization',
    content: 'Key techniques learned: 1) Use React.memo for expensive components, 2) Implement useMemo and useCallback for heavy computations, 3) Code splitting with React.lazy, 4) Virtual scrolling for large lists.',
    category: 'Learning',
    tags: ['react', 'performance', 'optimization']
  },
  {
    title: 'Shower Thought: Time Perception',
    content: 'Why does time feel faster as we age? Maybe it\'s because each year becomes a smaller fraction of our total life experience. A year to a 10-year-old is 10% of their life, but to a 50-year-old, it\'s only 2%.',
    category: 'Random Thoughts',
    tags: ['philosophy', 'time', 'perception']
  },
  {
    title: 'Design System Ideas',
    content: 'For the new project, consider using: 1) Tailwind CSS for utility-first styling, 2) Radix UI for accessible components, 3) Framer Motion for animations, 4) Storybook for component documentation.',
    category: 'Work',
    tags: ['design', 'frontend', 'tools']
  },
  {
    title: 'Travel Planning: Japan Trip',
    content: 'Must-visit places: Tokyo (Shibuya, Harajuku), Kyoto (temples, bamboo forest), Osaka (food scene). Duration: 2 weeks. Best time: Spring for cherry blossoms or fall for colors.',
    category: 'Personal',
    tags: ['travel', 'japan', 'planning']
  }
];

export const seedDemoData = async () => {
  try {
    // Check if data already exists
    const existingMemories = await memoryService.getAllMemories();
    if (existingMemories.length > 0) {
      console.log('Demo data already exists, skipping seed.');
      return;
    }

    console.log('Seeding demo data...');

    // Create categories
    const categoryMap = {};
    for (const cat of demoCategories) {
      const category = await categoryService.createCategory(cat.name, cat.color);
      categoryMap[cat.name] = category;
    }

    // Create memories
    for (const memory of demoMemories) {
      await memoryService.createMemory(memory);
    }

    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};

// Call this function to seed demo data
// seedDemoData();
