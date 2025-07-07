import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Tag,
  Heart,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Brain,
  Sparkles
} from 'lucide-react';
import { memoryService } from '../services/database';
import { aiService } from '../services/aiService';
import { notificationService } from '../services/notificationService';

const AnalyticsDashboard = () => {
  const [memories, setMemories] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalMemories: 0,
    memoriesThisWeek: 0,
    memoriesThisMonth: 0,
    favoriteCount: 0,
    avgMemoriesPerWeek: 0,
    topTags: [],
    topCategories: [],
    memoryGrowth: [],
    weeklyActivity: []
  });
  const [insights, setInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allMemories = await memoryService.getAllMemories();
      setMemories(allMemories);
      generateAnalytics(allMemories);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalytics = (memories) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Basic counts
    const totalMemories = memories.length;
    const memoriesThisWeek = memories.filter(m => new Date(m.createdAt) >= weekAgo).length;
    const memoriesThisMonth = memories.filter(m => new Date(m.createdAt) >= monthAgo).length;
    const favoriteCount = memories.filter(m => m.isFavorite).length;

    // Tag analysis
    const tagCounts = {};
    memories.forEach(memory => {
      if (memory.tags) {
        memory.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Category analysis
    const categoryCounts = {};
    memories.forEach(memory => {
      if (memory.category) {
        categoryCounts[memory.category] = (categoryCounts[memory.category] || 0) + 1;
      }
    });
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Weekly activity
    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayMemories = memories.filter(m => {
        const memDate = new Date(m.createdAt);
        return memDate.toDateString() === date.toDateString();
      }).length;
      
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayMemories
      };
    }).reverse();

    // Memory growth over time
    const memoryGrowth = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthMemories = memories.filter(m => {
        const memDate = new Date(m.createdAt);
        return memDate.getMonth() === date.getMonth() && memDate.getFullYear() === date.getFullYear();
      }).length;
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        count: monthMemories
      };
    }).reverse();

    // Calculate average
    const weeksActive = Math.max(1, Math.ceil((now - new Date(memories[memories.length - 1]?.createdAt || now)) / (7 * 24 * 60 * 60 * 1000)));
    const avgMemoriesPerWeek = Math.round(totalMemories / weeksActive * 10) / 10;

    setAnalytics({
      totalMemories,
      memoriesThisWeek,
      memoriesThisMonth,
      favoriteCount,
      avgMemoriesPerWeek,
      topTags,
      topCategories,
      memoryGrowth,
      weeklyActivity
    });
  };

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const insightsText = await aiService.generateInsights(memories.slice(0, 50));
      setInsights(insightsText);
      notificationService.success('AI insights generated!');
    } catch (error) {
      console.error('Error generating insights:', error);
      notificationService.error('Failed to generate insights. Make sure AI is configured.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {change >= 0 ? '+' : ''}{change}% this week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`h-8 w-8 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights into your memory patterns and habits
          </p>
        </div>
        
        <button
          onClick={generateAIInsights}
          disabled={isGeneratingInsights}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isGeneratingInsights ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>{isGeneratingInsights ? 'Generating...' : 'AI Insights'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Memories"
          value={analytics.totalMemories}
          icon={Brain}
          color="blue"
        />
        <StatCard
          title="This Week"
          value={analytics.memoriesThisWeek}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Favorites"
          value={analytics.favoriteCount}
          icon={Heart}
          color="red"
        />
        <StatCard
          title="Avg per Week"
          value={analytics.avgMemoriesPerWeek}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* AI Insights */}
      {insights && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI-Generated Insights
            </h3>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {insights}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Popular Tags
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.topTags.slice(0, 8).map((item, index) => (
              <div key={item.tag} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    #{item.tag}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.count / analytics.topTags[0]?.count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Activity
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.weeklyActivity.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {day.day}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ 
                        width: `${Math.max(10, (day.count / Math.max(...analytics.weeklyActivity.map(d => d.count))) * 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                    {day.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      {analytics.topCategories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Categories
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {analytics.topCategories.map((item, index) => (
              <div
                key={item.category}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.count}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
