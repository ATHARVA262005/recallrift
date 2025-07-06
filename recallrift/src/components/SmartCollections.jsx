import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Link,
  Folder,
  Tag,
  Brain,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { memoryService } from '../services/database';
import { aiService } from '../services/aiService';
import { notificationService } from '../services/notificationService';

const SmartCollections = ({ onCollectionChange, selectedCollection }) => {
  const [collections, setCollections] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    type: 'manual', // 'manual' or 'smart'
    criteria: {},
    color: 'blue'
  });
  const [isGeneratingSmartCollection, setIsGeneratingSmartCollection] = useState(false);

  const colors = [
    'blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'
  ];

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      // For now, we'll use localStorage to store collections
      // In a real app, this would be in the database
      const saved = localStorage.getItem('smart-collections');
      if (saved) {
        setCollections(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const saveCollections = (collectionsToSave) => {
    try {
      localStorage.setItem('smart-collections', JSON.stringify(collectionsToSave));
      setCollections(collectionsToSave);
    } catch (error) {
      console.error('Error saving collections:', error);
    }
  };

  const handleCreateCollection = async () => {
    try {
      if (!newCollection.name.trim()) {
        notificationService.error('Collection name is required');
        return;
      }

      const collection = {
        id: Date.now().toString(),
        ...newCollection,
        createdAt: new Date().toISOString(),
        memoryCount: 0
      };

      const updatedCollections = [...collections, collection];
      saveCollections(updatedCollections);
      
      notificationService.success('Collection created successfully!');
      setIsCreating(false);
      setNewCollection({
        name: '',
        description: '',
        type: 'manual',
        criteria: {},
        color: 'blue'
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      notificationService.error('Failed to create collection');
    }
  };

  const handleDeleteCollection = (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      const updatedCollections = collections.filter(c => c.id !== collectionId);
      saveCollections(updatedCollections);
      notificationService.success('Collection deleted');
    }
  };

  const generateSmartCollection = async () => {
    try {
      setIsGeneratingSmartCollection(true);
      
      // Get all memories for analysis
      const memories = await memoryService.getAllMemories();
      
      if (memories.length === 0) {
        notificationService.error('No memories found to analyze');
        return;
      }

      // Use AI to suggest smart collections
      const suggestions = await aiService.generateCollectionSuggestions(memories);
      
      // Create a smart collection based on AI suggestions
      const smartCollection = {
        id: Date.now().toString(),
        name: suggestions.name || 'AI Generated Collection',
        description: suggestions.description || 'Smart collection based on your memory patterns',
        type: 'smart',
        criteria: suggestions.criteria || {},
        color: suggestions.color || 'purple',
        createdAt: new Date().toISOString(),
        memoryCount: suggestions.estimatedCount || 0
      };

      const updatedCollections = [...collections, smartCollection];
      saveCollections(updatedCollections);
      
      notificationService.success('Smart collection generated!');
    } catch (error) {
      console.error('Error generating smart collection:', error);
      notificationService.error('Failed to generate smart collection');
    } finally {
      setIsGeneratingSmartCollection(false);
    }
  };

  const getCollectionMemories = async (collection) => {
    try {
      if (collection.type === 'manual') {
        // For manual collections, we'd need to store memory IDs
        // This would require database schema changes
        return [];
      } else {
        // For smart collections, filter based on criteria
        return await memoryService.filterMemories(collection.criteria);
      }
    } catch (error) {
      console.error('Error getting collection memories:', error);
      return [];
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Smart Collections
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize memories into intelligent groups
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={generateSmartCollection}
            disabled={isGeneratingSmartCollection}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isGeneratingSmartCollection ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>AI Generate</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Collection</span>
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => onCollectionChange(collection)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedCollection?.id === collection.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`p-2 rounded-full bg-${collection.color}-100 dark:bg-${collection.color}-900 mr-3`}>
                  {collection.type === 'smart' ? (
                    <Brain className={`h-5 w-5 text-${collection.color}-600 dark:text-${collection.color}-400`} />
                  ) : (
                    <Folder className={`h-5 w-5 text-${collection.color}-600 dark:text-${collection.color}-400`} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {collection.memoryCount} memories
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCollection(collection);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCollection(collection.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {collection.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full ${
                collection.type === 'smart'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {collection.type === 'smart' ? 'Smart' : 'Manual'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(collection.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Collection Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Collection
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter collection name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCollection.description}
                    onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows="3"
                    placeholder="Describe this collection"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCollection({...newCollection, color})}
                        className={`w-8 h-8 rounded-full bg-${color}-500 ${
                          newCollection.color === color
                            ? 'ring-2 ring-offset-2 ring-gray-400'
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCollections;
