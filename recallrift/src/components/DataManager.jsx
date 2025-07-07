import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  Archive,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  Filter,
  Settings
} from 'lucide-react';
import { memoryService, categoryService } from '../services/database';
import { notificationService } from '../services/notificationService';

const DataManager = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [exportFormat, setExportFormat] = useState('json');
  const [exportOptions, setExportOptions] = useState({
    includeDeleted: false,
    includeMetadata: true,
    dateRange: 'all', // 'all', 'custom', 'last30', 'last90'
    customStartDate: '',
    customEndDate: '',
    categories: [],
    tags: []
  });
  const [importOptions, setImportOptions] = useState({
    mergeMode: 'skip', // 'skip', 'replace', 'merge'
    preserveIds: false,
    validateData: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  React.useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const categories = await categoryService.getAllCategories();
      const memories = await memoryService.getAllMemories();
      const tags = [...new Set(memories.flatMap(m => m.tags || []))];
      
      setAvailableCategories(categories);
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let memories = await memoryService.getAllMemories();
      
      // Apply filters
      if (exportOptions.dateRange !== 'all') {
        memories = filterByDate(memories);
      }
      
      if (exportOptions.categories.length > 0) {
        memories = memories.filter(m => 
          exportOptions.categories.includes(m.category)
        );
      }
      
      if (exportOptions.tags.length > 0) {
        memories = memories.filter(m => 
          m.tags?.some(tag => exportOptions.tags.includes(tag))
        );
      }

      // Prepare export data
      const exportData = {
        metadata: {
          version: '1.0',
          exportDate: new Date().toISOString(),
          totalMemories: memories.length,
          exportOptions: exportOptions
        },
        memories: memories.map(memory => ({
          ...memory,
          ...(exportOptions.includeMetadata ? {} : {
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined
          })
        }))
      };

      // Add categories if exporting everything
      if (exportOptions.categories.length === 0) {
        exportData.categories = await categoryService.getAllCategories();
      }

      // Generate and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: exportFormat === 'json' ? 'application/json' : 'text/plain'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recallrift-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      notificationService.success(`Exported ${memories.length} memories successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      notificationService.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      let importData;
      
      try {
        importData = JSON.parse(text);
      } catch (error) {
        throw new Error('Invalid JSON format');
      }

      // Validate import data
      if (importOptions.validateData && !validateImportData(importData)) {
        throw new Error('Invalid data format');
      }

      let imported = 0;
      let skipped = 0;
      let errors = 0;

      // Import memories
      for (const memory of importData.memories || []) {
        try {
          const existingMemory = await memoryService.getMemoryById(memory.id);
          
          if (existingMemory && importOptions.mergeMode === 'skip') {
            skipped++;
            continue;
          }

          if (existingMemory && importOptions.mergeMode === 'replace') {
            await memoryService.updateMemory(memory.id, {
              ...memory,
              ...(importOptions.preserveIds ? {} : { id: undefined })
            });
          } else {
            await memoryService.createMemory({
              ...memory,
              ...(importOptions.preserveIds ? {} : { id: undefined })
            });
          }
          
          imported++;
        } catch (error) {
          console.error('Error importing memory:', error);
          errors++;
        }
      }

      // Import categories
      if (importData.categories) {
        for (const category of importData.categories) {
          try {
            const existing = await categoryService.getCategoryByName(category.name);
            if (!existing) {
              await categoryService.createCategory(category);
            }
          } catch (error) {
            console.error('Error importing category:', error);
          }
        }
      }

      setImportResults({
        imported,
        skipped,
        errors,
        total: importData.memories?.length || 0
      });

      notificationService.success(`Import completed! ${imported} memories imported.`);
    } catch (error) {
      console.error('Import error:', error);
      notificationService.error(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const filterByDate = (memories) => {
    const now = new Date();
    let startDate, endDate;

    switch (exportOptions.dateRange) {
      case 'last30':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'last90':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'custom':
        startDate = new Date(exportOptions.customStartDate);
        endDate = new Date(exportOptions.customEndDate);
        break;
      default:
        return memories;
    }

    return memories.filter(memory => {
      const memoryDate = new Date(memory.createdAt);
      return memoryDate >= startDate && memoryDate <= endDate;
    });
  };

  const validateImportData = (data) => {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.memories) &&
      data.memories.every(memory => 
        memory.title && memory.content && memory.createdAt
      )
    );
  };

  const generateBackup = async () => {
    try {
      const fullBackup = {
        metadata: {
          version: '1.0',
          backupDate: new Date().toISOString(),
          type: 'full-backup'
        },
        memories: await memoryService.getAllMemories(),
        categories: await categoryService.getAllCategories(),
        settings: {
          // Add any app settings here
        }
      };

      const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recallrift-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      notificationService.success('Full backup created successfully!');
    } catch (error) {
      console.error('Backup error:', error);
      notificationService.error('Backup failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Export and import your memories
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'export'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Download className="h-4 w-4 inline mr-2" />
            Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'import'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Import
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'backup'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Archive className="h-4 w-4 inline mr-2" />
            Backup
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="json">JSON</option>
                  <option value="txt">Plain Text</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={exportOptions.dateRange}
                  onChange={(e) => setExportOptions({...exportOptions, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last90">Last 90 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Custom Date Range */}
              {exportOptions.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exportOptions.customStartDate}
                      onChange={(e) => setExportOptions({...exportOptions, customStartDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exportOptions.customEndDate}
                      onChange={(e) => setExportOptions({...exportOptions, customEndDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={(e) => setExportOptions({...exportOptions, includeMetadata: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Include metadata (IDs, timestamps)
                  </span>
                </label>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* Import Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Merge Mode
                </label>
                <select
                  value={importOptions.mergeMode}
                  onChange={(e) => setImportOptions({...importOptions, mergeMode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="skip">Skip existing memories</option>
                  <option value="replace">Replace existing memories</option>
                  <option value="merge">Merge with existing</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importOptions.preserveIds}
                    onChange={(e) => setImportOptions({...importOptions, preserveIds: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Preserve original IDs
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importOptions.validateData}
                    onChange={(e) => setImportOptions({...importOptions, validateData: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Validate data before import
                  </span>
                </label>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Import Results */}
              {importResults && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Import Results
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>{importResults.imported} memories imported</span>
                    </div>
                    <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{importResults.skipped} memories skipped</span>
                    </div>
                    {importResults.errors > 0 && (
                      <div className="flex items-center text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>{importResults.errors} errors</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isImporting && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Importing...</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="text-center">
                <Archive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Full Backup
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create a complete backup of all your memories, categories, and settings.
                </p>
                
                <button
                  onClick={generateBackup}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mx-auto"
                >
                  <Database className="h-5 w-5" />
                  <span>Create Full Backup</span>
                </button>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                    Backup Recommendations
                  </span>
                </div>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Create backups regularly to prevent data loss</li>
                  <li>• Store backups in a safe location (cloud storage, external drive)</li>
                  <li>• Test your backups by importing them occasionally</li>
                  <li>• Keep multiple backup versions for added security</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManager;
