import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageCircle, 
  Brain, 
  Loader2,
  Search,
  Lightbulb,
  Sparkles,
  Settings,
  Zap,
  TrendingUp
} from 'lucide-react';
import { memoryService } from '../services/database';
import { aiService } from '../services/aiService';
import { notificationService } from '../services/notificationService';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState([]);
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [chatMode, setChatMode] = useState('smart'); // 'smart' or 'basic'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMemories();
    checkAiStatus();
    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'system',
        content: "Hi! I'm your memory assistant. I can help you search through your memories using natural language. Try asking me about your thoughts, ideas, or any specific topics you've captured.",
        timestamp: new Date()
      }
    ]);
  }, []);

  const loadMemories = async () => {
    try {
      const allMemories = await memoryService.getAllMemories();
      setMemories(allMemories);
    } catch (error) {
      console.error('Error loading memories:', error);
    }
  };

  const checkAiStatus = async () => {
    try {
      const initialized = await aiService.initialize();
      setIsAiEnabled(initialized);
    } catch (error) {
      console.log('AI not available:', error.message);
      setIsAiEnabled(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      if (isAiEnabled && chatMode === 'smart') {
        response = await aiService.searchMemories(inputMessage, memories);
      } else {
        response = await basicSearch(inputMessage);
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I encountered an error while searching your memories. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const basicSearch = async (query) => {
    const searchResults = await memoryService.searchMemories(query);
    
    if (searchResults.length === 0) {
      return `I couldn't find any memories matching "${query}". Try using different keywords or check your memory collection.`;
    }

    if (searchResults.length === 1) {
      const memory = searchResults[0];
      return `I found one memory about "${memory.title}":\n\n${memory.content}\n\n*Created on ${new Date(memory.createdAt).toLocaleDateString()}*`;
    }

    // Multiple results
    let response = `I found ${searchResults.length} memories related to "${query}":\n\n`;
    searchResults.slice(0, 3).forEach((memory, index) => {
      response += `${index + 1}. **${memory.title}**\n   ${memory.content.substring(0, 100)}...\n   *${new Date(memory.createdAt).toLocaleDateString()}*\n\n`;
    });

    if (searchResults.length > 3) {
      response += `And ${searchResults.length - 3} more memories. Try being more specific to narrow down the results.`;
    }

    return response;
  };

  const handleQuickSearch = (query) => {
    setInputMessage(query);
  };

  const handleGenerateInsights = async () => {
    if (!isAiEnabled) {
      notificationService.error('AI insights require API configuration');
      return;
    }

    setIsLoading(true);
    try {
      const insights = await aiService.generateInsights(memories);
      
      const insightsMessage = {
        id: Date.now(),
        type: 'insights',
        content: insights,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, insightsMessage]);
    } catch (error) {
      notificationService.error('Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  const quickSearchQueries = [
    "What did I think about yesterday?",
    "Show me my recent ideas",
    "Find my work-related memories",
    "What are my favorite memories?",
    "Show me memories about productivity",
    "Find my learning notes"
  ];

  const smartFeatures = [
    {
      icon: Sparkles,
      title: "AI-Powered Search",
      description: "Natural language queries with context understanding",
      enabled: isAiEnabled
    },
    {
      icon: TrendingUp,
      title: "Memory Insights",
      description: "Generate patterns and themes from your memories",
      enabled: isAiEnabled,
      action: handleGenerateInsights
    },
    {
      icon: Brain,
      title: "Smart Summaries",
      description: "AI-generated summaries for long memories",
      enabled: isAiEnabled
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Memory Assistant
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chat with your {memories.length} stored memories
            </p>
          </div>
        </div>

        {/* AI Status & Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isAiEnabled 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            <Zap className="h-4 w-4" />
            <span>{isAiEnabled ? 'AI Enabled' : 'Basic Mode'}</span>
          </div>
          
          {isAiEnabled && (
            <select
              value={chatMode}
              onChange={(e) => setChatMode(e.target.value)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="smart">Smart Chat</option>
              <option value="basic">Basic Search</option>
            </select>
          )}
        </div>
      </div>

      {/* Smart Features Panel */}
      {isAiEnabled && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {smartFeatures.map((feature, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-colors ${
                  feature.enabled
                    ? 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600'
                    : 'bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <feature.icon className={`h-4 w-4 ${
                    feature.enabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                  }`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                {feature.action && feature.enabled && (
                  <button
                    onClick={feature.action}
                    className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Generate Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : message.type === 'insights'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'assistant' && (
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                )}
                {message.type === 'system' && (
                  <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                )}
                {message.type === 'insights' && (
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                )}
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
              <div className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isAiEnabled && chatMode === 'smart' ? 'AI is thinking...' : 'Searching memories...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Search Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickSearchQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(query)}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isAiEnabled ? "Ask me anything about your memories..." : "Search your memories..."}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
