import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  Database,
  Palette,
  Key,
  Save,
  FileText,
  AlertTriangle,
  Check,
  HardDrive
} from 'lucide-react';
import { memoryService, categoryService, settingsService } from '../services/database';
import DataManager from '../components/DataManager';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [stats, setStats] = useState({ memories: 0, categories: 0 });
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);

  useEffect(() => {
    loadStats();
    loadApiKey();
  }, []);

  const loadStats = async () => {
    try {
      const memories = await memoryService.getAllMemories();
      const categories = await categoryService.getAllCategories();
      setStats({ memories: memories.length, categories: categories.length });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadApiKey = async () => {
    try {
      const savedKey = await settingsService.getSetting('geminiApiKey', '');
      setApiKey(savedKey);
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  const handleSaveApiKey = async () => {
    try {
      await settingsService.setSetting('geminiApiKey', apiKey);
      showMessage('success', 'API key saved successfully!');
    } catch (error) {
      console.error('Error saving API key:', error);
      showMessage('error', 'Failed to save API key');
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const memories = await memoryService.getAllMemories();
      const categories = await categoryService.getAllCategories();
      
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        memories,
        categories
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recallrift-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showMessage('success', 'Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showMessage('error', 'Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.memories || !Array.isArray(importData.memories)) {
        throw new Error('Invalid export file format');
      }

      // Import categories first
      if (importData.categories) {
        for (const category of importData.categories) {
          await categoryService.createCategory(category.name, category.color);
        }
      }

      // Import memories
      for (const memory of importData.memories) {
        await memoryService.createMemory({
          title: memory.title,
          content: memory.content,
          category: memory.category,
          tags: memory.tags || []
        });
      }

      await loadStats();
      showMessage('success', `Imported ${importData.memories.length} memories successfully!`);
    } catch (error) {
      console.error('Error importing data:', error);
      showMessage('error', 'Failed to import data. Please check the file format.');
    } finally {
      setIsLoading(false);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Clear all memories
      const memories = await memoryService.getAllMemories();
      for (const memory of memories) {
        await memoryService.deleteMemory(memory.id);
      }

      // Clear all categories
      const categories = await categoryService.getAllCategories();
      for (const category of categories) {
        await categoryService.deleteCategory(category.id);
      }

      await loadStats();
      showMessage('success', 'All data cleared successfully!');
    } catch (error) {
      console.error('Error clearing data:', error);
      showMessage('error', 'Failed to clear data');
    } finally {
      setIsLoading(false);
    }
  };

  const settingsTabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'ai', label: 'AI Configuration', icon: Key },
    { id: 'data', label: 'Data Management', icon: HardDrive },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your RecallRift preferences and data
        </p>
      </div>

      {/* Message */}
      {message.content && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{message.content}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.memories}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Memories
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Palette className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.categories}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Categories
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  About RecallRift
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  RecallRift is your local-first, AI-powered second brain for capturing and recalling thoughts, ideas, and insights.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Version: 1.0.0</p>
                  <p>Build: Development</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  AI Configuration
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Configure your AI settings to enable advanced memory search and chat features.
                </p>
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gemini API Key
                </label>
                <div className="flex space-x-3">
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Get your API key from{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Data Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Export, import, backup, or clear your RecallRift data.
                </p>
              </div>

              <div className="space-y-4">
                {/* Advanced Data Manager */}
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Advanced Data Manager</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Full-featured export, import, and backup tools
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDataManagerOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Open Manager
                  </button>
                </div>

                {/* Quick Export */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Quick Export</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Download all your memories and categories as JSON
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleExport}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    {isLoading ? 'Exporting...' : 'Export'}
                  </button>
                </div>

                {/* Quick Import */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Upload className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Quick Import</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Import memories from a JSON export file
                      </p>
                    </div>
                  </div>
                  <label className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                      disabled={isLoading}
                    />
                    {isLoading ? 'Importing...' : 'Import'}
                  </label>
                </div>

                {/* Clear Data */}
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Clear All Data</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Permanently delete all memories and categories
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearData}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    {isLoading ? 'Clearing...' : 'Clear All'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Appearance Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Customize the look and feel of RecallRift.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newTheme = document.documentElement.className === 'dark' ? 'light' : 'dark';
                      document.documentElement.className = newTheme;
                      settingsService.setSetting('theme', newTheme);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Toggle Theme
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Manager Modal */}
      {isDataManagerOpen && (
        <DataManager onClose={() => setIsDataManagerOpen(false)} />
      )}
    </div>
  );
};

export default Settings;
