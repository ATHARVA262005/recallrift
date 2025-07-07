import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  Target,
  Brain,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  Filter,
  RefreshCw
} from 'lucide-react';
import { memoryService } from '../services/database';
import { aiService } from '../services/aiService';
import { notificationService } from '../services/notificationService';
import SEO from '../components/SEO';

const ProductivityDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalMemories: 0,
      thisWeek: 0,
      thisMonth: 0,
      averageDaily: 0,
      streakDays: 0,
      productivityScore: 0
    },
    trends: {
      daily: [],
      weekly: [],
      categories: []
    },
    insights: {
      peakHours: [],
      topCategories: [],
      growthAreas: [],
      recommendations: []
    },
    goals: {
      daily: { target: 3, current: 0 },
      weekly: { target: 20, current: 0 },
      monthly: { target: 80, current: 0 }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'year'
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const memories = await memoryService.getAllMemories();
      const processedData = await processMemoryData(memories);
      setDashboardData(processedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      notificationService.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const processMemoryData = async (memories) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Basic statistics
    const thisWeekMemories = memories.filter(m => new Date(m.createdAt) >= weekAgo);
    const thisMonthMemories = memories.filter(m => new Date(m.createdAt) >= monthAgo);
    
    // Calculate streak
    const streakDays = calculateStreakDays(memories);
    
    // Calculate productivity score (0-100)
    const productivityScore = calculateProductivityScore(memories, streakDays);

    // Process trends
    const dailyTrends = generateDailyTrends(memories);
    const weeklyTrends = generateWeeklyTrends(memories);
    const categoryTrends = generateCategoryTrends(memories);

    // Peak hours analysis
    const peakHours = analyzePeakHours(memories);
    
    // Top categories
    const topCategories = analyzeTopCategories(memories);

    // Generate AI insights if available
    let aiInsights = { recommendations: [], growthAreas: [] };
    try {
      if (memories.length > 0) {
        aiInsights = await aiService.generateProductivityInsights(memories);
      }
    } catch (error) {
      console.log('AI insights not available:', error);
    }

    return {
      overview: {
        totalMemories: memories.length,
        thisWeek: thisWeekMemories.length,
        thisMonth: thisMonthMemories.length,
        averageDaily: Math.round(thisMonthMemories.length / 30 * 10) / 10,
        streakDays,
        productivityScore
      },
      trends: {
        daily: dailyTrends,
        weekly: weeklyTrends,
        categories: categoryTrends
      },
      insights: {
        peakHours,
        topCategories,
        growthAreas: aiInsights.growthAreas || [],
        recommendations: aiInsights.recommendations || []
      },
      goals: {
        daily: { target: 3, current: getTodayMemoryCount(memories) },
        weekly: { target: 20, current: thisWeekMemories.length },
        monthly: { target: 80, current: thisMonthMemories.length }
      }
    };
  };

  const calculateStreakDays = (memories) => {
    if (memories.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dayMemories = memories.filter(m => {
        const memoryDate = new Date(m.createdAt);
        memoryDate.setHours(0, 0, 0, 0);
        return memoryDate.getTime() === currentDate.getTime();
      });
      
      if (dayMemories.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateProductivityScore = (memories, streakDays) => {
    if (memories.length === 0) return 0;
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentMemories = memories.filter(m => new Date(m.createdAt) >= weekAgo);
    
    // Factors: consistency (streak), volume (recent memories), engagement (favorites)
    const consistencyScore = Math.min(streakDays * 10, 40); // Max 40 points
    const volumeScore = Math.min(recentMemories.length * 3, 30); // Max 30 points
    const engagementScore = Math.min(memories.filter(m => m.isFavorite).length * 2, 30); // Max 30 points
    
    return Math.round(consistencyScore + volumeScore + engagementScore);
  };

  const generateDailyTrends = (memories) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayMemories = memories.filter(m => {
        const memoryDate = new Date(m.createdAt);
        memoryDate.setHours(0, 0, 0, 0);
        return memoryDate.getTime() === date.getTime();
      });
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        count: dayMemories.length
      });
    }
    return last7Days;
  };

  const generateWeeklyTrends = (memories) => {
    const last4Weeks = [];
    for (let i = 3; i >= 0; i--) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - (i * 7));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      
      const weekMemories = memories.filter(m => {
        const memoryDate = new Date(m.createdAt);
        return memoryDate >= startDate && memoryDate <= endDate;
      });
      
      last4Weeks.push({
        week: `Week ${4 - i}`,
        count: weekMemories.length
      });
    }
    return last4Weeks;
  };

  const generateCategoryTrends = (memories) => {
    const categoryCount = {};
    memories.forEach(memory => {
      if (memory.category) {
        categoryCount[memory.category] = (categoryCount[memory.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const analyzePeakHours = (memories) => {
    const hourCounts = {};
    memories.forEach(memory => {
      const hour = new Date(memory.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const analyzeTopCategories = (memories) => {
    const categoryCount = {};
    memories.forEach(memory => {
      if (memory.category) {
        categoryCount[memory.category] = (categoryCount[memory.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getTodayMemoryCount = (memories) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return memories.filter(m => {
      const memoryDate = new Date(m.createdAt);
      return memoryDate >= today && memoryDate < tomorrow;
    }).length;
  };

  const getGoalProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getGoalColor = (progress) => {
    if (progress >= 100) return 'green';
    if (progress >= 75) return 'blue';
    if (progress >= 50) return 'yellow';
    return 'red';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Analytics Dashboard - RecallRift Productivity Insights"
        description="Track your knowledge creation patterns with RecallRift's analytics dashboard. View productivity trends, memory statistics, and insights to optimize your second brain workflow."
        keywords="analytics, productivity dashboard, memory statistics, knowledge trends, productivity insights, data visualization, performance tracking, memory analytics"
        url="/analytics"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "RecallRift Analytics Dashboard",
          "description": "Productivity and analytics dashboard for tracking memory creation patterns and knowledge management insights",
          "url": "https://dashboard-recallrift.atharvaralegankar.tech/analytics",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "RecallRift Analytics",
            "applicationCategory": "ProductivityApplication",
            "featureList": ["Productivity Tracking", "Memory Analytics", "Trend Analysis", "Performance Insights"]
          }
        }}
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Productivity Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your memory creation patterns and productivity
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={loadDashboardData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Productivity Score
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData.overview.productivityScore}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Current streak: {dashboardData.overview.streakDays} days</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Memories
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData.overview.totalMemories}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>+{dashboardData.overview.thisWeek} this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Daily Average
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData.overview.averageDaily}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Last 30 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Peak Hour
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData.insights.peakHours.length > 0 
                  ? `${dashboardData.insights.peakHours[0].hour}:00`
                  : 'N/A'
                }
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Most active time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Memory Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(dashboardData.goals).map(([period, goal]) => {
            const progress = getGoalProgress(goal.current, goal.target);
            const color = getGoalColor(progress);
            
            return (
              <div key={period} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className={`h-5 w-5 text-${color}-600 dark:text-${color}-400 mr-2`} />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {period}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goal.current} / {goal.target}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {progress}% complete
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Activity
          </h3>
          <div className="space-y-3">
            {dashboardData.trends.daily.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {day.date}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min((day.count / Math.max(...dashboardData.trends.daily.map(d => d.count), 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-6 text-right">
                    {day.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Categories
          </h3>
          <div className="space-y-3">
            {dashboardData.insights.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.category}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((category.count / Math.max(...dashboardData.insights.topCategories.map(c => c.count), 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-6 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {dashboardData.insights.recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Insights & Recommendations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.insights.recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
    </div>
    </>
  );
};

export default ProductivityDashboard;
