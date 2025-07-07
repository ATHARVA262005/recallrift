import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Brain,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { memoryService, categoryService } from '../services/database';
import MemoryForm from '../components/MemoryForm';
import EnhancedMemoryCard from '../components/EnhancedMemoryCard';
import AdvancedSearch from '../components/AdvancedSearch';
import { notificationService } from '../services/notificationService';

const Home = () => {
  const [memories, setMemories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    favorites: 0,
    thisWeek: 0,
    categories: 0
  });

  // Load memories and categories on mount
  useEffect(() => {
    loadMemories();
    loadCategories();
  }, []);

  // Load memories with advanced filters
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      applyFilters();
    } else {
      loadMemories();
    }
  }, [filters]);

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const allMemories = await memoryService.getAllMemories();
      setMemories(allMemories);
      calculateStats(allMemories);
    } catch (error) {
      console.error('Error loading memories:', error);
      notificationService.error('Failed to load memories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const allCategories = await categoryService.getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const calculateStats = (memories) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: memories.length,
      favorites: memories.filter(m => m.isFavorite).length,
      thisWeek: memories.filter(m => new Date(m.createdAt) >= weekAgo).length,
      categories: categories.length
    };
    
    setStats(stats);
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const filteredMemories = await memoryService.filterMemories(filters);
      setMemories(filteredMemories);
    } catch (error) {
      console.error('Error filtering memories:', error);
      notificationService.error('Failed to filter memories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleMemorySubmit = async (memoryData) => {
    try {
      const loadingToast = notificationService.loading('Saving memory...');
      
      if (editingMemory) {
        await memoryService.updateMemory(editingMemory.id, memoryData);
        notificationService.dismiss(loadingToast);
        notificationService.success('Memory updated successfully!');
        setEditingMemory(null);
      } else {
        await memoryService.createMemory(memoryData);
        notificationService.dismiss(loadingToast);
        notificationService.success('Memory created successfully!');
      }
      
      setIsFormOpen(false);
      loadMemories();
    } catch (error) {
      console.error('Error saving memory:', error);
      notificationService.error('Failed to save memory');
    }
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await memoryService.deleteMemory(id);
        notificationService.success('Memory deleted successfully!');
        loadMemories();
      } catch (error) {
        console.error('Error deleting memory:', error);
        notificationService.error('Failed to delete memory');
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await memoryService.toggleFavorite(id);
      loadMemories();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      notificationService.error('Failed to update favorite status');
    }
  };

  const statsCards = [
    {
      title: 'Total Memories',
      value: stats.total,
      icon: Brain,
      color: 'blue'
    },
    {
      title: 'Favorites',
      value: stats.favorites,
      icon: Star,
      color: 'red'
    },
    {
      title: 'This Week',
      value: stats.thisWeek,
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Memory Vault
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Capture, organize, and rediscover your thoughts and ideas
          </p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Search */}
      <AdvancedSearch
        onFilter={handleFilterChange}
        memories={memories}
        categories={categories}
      />

      {/* Memory Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-16">
          <Brain className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            {Object.keys(filters).length > 0 ? 'No memories found' : 'No memories yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
              : 'Start building your second brain by capturing your first thought, idea, or insight.'}
          </p>
          {Object.keys(filters).length === 0 && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Create your first memory
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map(memory => (
            <EnhancedMemoryCard
              key={memory.id}
              memory={memory}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Memory Form Modal */}
      {isFormOpen && (
        <MemoryForm
          memory={editingMemory}
          categories={categories}
          onSubmit={handleMemorySubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMemory(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;
