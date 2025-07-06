import Dexie from 'dexie';
import Fuse from 'fuse.js';

export class RecallRiftDB extends Dexie {
  constructor() {
    super('RecallRiftDB');
    
    // Define schema
    this.version(1).stores({
      memories: '++id, title, content, tags, category, createdAt, updatedAt, isFavorite',
      categories: '++id, name, color, createdAt',
      settings: '++id, key, value'
    });
  }
}

// Create database instance
export const db = new RecallRiftDB();

// Database operations
export const memoryService = {
  // Create a new memory
  async createMemory(memoryData) {
    const now = new Date();
    const memory = {
      ...memoryData,
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      tags: memoryData.tags || [],
    };
    
    const id = await db.memories.add(memory);
    return { ...memory, id };
  },

  // Get all memories
  async getAllMemories() {
    return await db.memories.orderBy('createdAt').reverse().toArray();
  },

  // Get memories by search term with fuzzy search
  async searchMemories(searchTerm, options = {}) {
    const allMemories = await this.getAllMemories();
    
    if (!searchTerm) return allMemories;
    
    // Configure Fuse.js for fuzzy search
    const fuseOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.6,
      includeScore: true,
      ...options
    };
    
    const fuse = new Fuse(allMemories, fuseOptions);
    const results = fuse.search(searchTerm);
    
    return results.map(result => result.item);
  },

  // Advanced filter with multiple criteria
  async filterMemories(filters) {
    let memories = await this.getAllMemories();
    
    // Apply search query
    if (filters.query) {
      memories = await this.searchMemories(filters.query);
    }
    
    // Filter by category
    if (filters.category) {
      memories = memories.filter(memory => memory.category === filters.category);
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      memories = memories.filter(memory => 
        memory.tags && filters.tags.some(tag => memory.tags.includes(tag))
      );
    }
    
    // Filter by favorites
    if (filters.favorites) {
      memories = memories.filter(memory => memory.isFavorite);
    }
    
    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      const ranges = {
        today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getFullYear(), now.getMonth(), 1),
        quarter: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
        year: new Date(now.getFullYear(), 0, 1)
      };
      
      const startDate = ranges[filters.dateRange];
      if (startDate) {
        memories = memories.filter(memory => new Date(memory.createdAt) >= startDate);
      }
    }
    
    // Sort memories
    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    memories.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return memories;
  },

  // Get memories by category
  async getMemoriesByCategory(category) {
    return await db.memories
      .where('category')
      .equals(category)
      .reverse()
      .toArray();
  },

  // Update memory
  async updateMemory(id, updates) {
    const updatedMemory = {
      ...updates,
      updatedAt: new Date()
    };
    
    await db.memories.update(id, updatedMemory);
    return await db.memories.get(id);
  },

  // Delete memory
  async deleteMemory(id) {
    await db.memories.delete(id);
  },

  // Toggle favorite
  async toggleFavorite(id) {
    const memory = await db.memories.get(id);
    if (memory) {
      await db.memories.update(id, { 
        isFavorite: !memory.isFavorite,
        updatedAt: new Date()
      });
    }
  }
};

// Category operations
export const categoryService = {
  // Create category
  async createCategory(name, color = '#3B82F6') {
    const category = {
      name,
      color,
      createdAt: new Date()
    };
    
    const id = await db.categories.add(category);
    return { ...category, id };
  },

  // Get all categories
  async getAllCategories() {
    return await db.categories.orderBy('name').toArray();
  },

  // Delete category
  async deleteCategory(id) {
    await db.categories.delete(id);
  }
};

// Settings operations
export const settingsService = {
  // Get setting
  async getSetting(key, defaultValue = null) {
    const setting = await db.settings.where('key').equals(key).first();
    return setting ? setting.value : defaultValue;
  },

  // Set setting
  async setSetting(key, value) {
    const existing = await db.settings.where('key').equals(key).first();
    
    if (existing) {
      await db.settings.update(existing.id, { value });
    } else {
      await db.settings.add({ key, value });
    }
  }
};
