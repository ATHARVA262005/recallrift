import { GoogleGenerativeAI } from '@google/generative-ai';
import { settingsService } from './database.js';

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      const apiKey = await settingsService.getSetting('geminiApiKey');
      
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.isInitialized = true;
      
      return true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      this.isInitialized = false;
      return false;
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.isInitialized) {
      throw new Error('AI service not initialized. Please configure your API key in Settings.');
    }
  }

  async searchMemories(query, memories) {
    await this.ensureInitialized();
    
    try {
      const context = this.buildMemoryContext(memories);
      
      const prompt = `
You are an AI assistant helping users search through their personal memories. 
Based on the user's query, find the most relevant memories and provide a helpful response.

User's memories:
${context}

User's query: "${query}"

Please:
1. Identify the most relevant memories
2. Provide a conversational response
3. Include specific details from the memories
4. If no relevant memories are found, suggest alternative searches

Format your response naturally, as if you're having a conversation with the user.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('AI search error:', error);
      throw new Error('Failed to process AI search. Please try again.');
    }
  }

  async summarizeMemory(memory) {
    await this.ensureInitialized();
    
    try {
      const prompt = `
Please provide a brief, insightful summary of this memory:

Title: ${memory.title}
Content: ${memory.content}
Category: ${memory.category || 'None'}
Tags: ${memory.tags?.join(', ') || 'None'}
Created: ${new Date(memory.createdAt).toLocaleDateString()}

Create a 1-2 sentence summary that captures the key insight or main point.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('AI summarization error:', error);
      throw new Error('Failed to generate summary.');
    }
  }

  async suggestTags(content) {
    await this.ensureInitialized();
    
    try {
      const prompt = `
Based on the following content, suggest 3-5 relevant tags that would help categorize and find this memory later.
Return only the tags, separated by commas, without any additional text.

Content: ${content}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text()
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);
    } catch (error) {
      console.error('AI tag suggestion error:', error);
      return [];
    }
  }

  async generateInsights(memories) {
    await this.ensureInitialized();
    
    try {
      const recentMemories = memories
        .slice(0, 20)
        .map(m => `${m.title}: ${m.content.substring(0, 200)}...`)
        .join('\n\n');

      const prompt = `
Analyze these recent memories and provide insights about patterns, themes, or interesting observations:

${recentMemories}

Please provide:
1. Common themes or topics
2. Notable patterns in thinking
3. Interesting connections between ideas
4. Suggestions for future exploration

Keep the response conversational and insightful.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('AI insights error:', error);
      throw new Error('Failed to generate insights.');
    }
  }

  /**
   * Generate smart collection suggestions based on memory patterns
   */
  async generateCollectionSuggestions(memories) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    // Analyze memory patterns
    const categoryAnalysis = this.analyzeCategoryPatterns(memories);
    const tagAnalysis = this.analyzeTagPatterns(memories);
    const contentAnalysis = this.analyzeContentPatterns(memories);

    const analysisPrompt = `
Based on the following memory analysis, suggest 1-3 smart collections that would help organize these memories:

Categories: ${JSON.stringify(categoryAnalysis)}
Tags: ${JSON.stringify(tagAnalysis)}
Content Themes: ${JSON.stringify(contentAnalysis)}

Total memories: ${memories.length}

Please suggest collections with:
1. A descriptive name
2. A brief description
3. Smart criteria (tags, categories, keywords)
4. A suitable color (blue, green, purple, red, yellow, indigo, pink, gray)
5. Estimated memory count

Format as JSON with structure:
{
  "name": "Collection Name",
  "description": "Brief description",
  "criteria": {
    "tags": ["tag1", "tag2"],
    "categories": ["category1"],
    "keywords": ["keyword1", "keyword2"]
  },
  "color": "blue",
  "estimatedCount": 10
}
`;

    try {
      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback suggestion
      return {
        name: 'Recent Thoughts',
        description: 'Your most recent memories and ideas',
        criteria: {
          tags: tagAnalysis.slice(0, 3),
          categories: categoryAnalysis.slice(0, 2),
          keywords: []
        },
        color: 'purple',
        estimatedCount: Math.min(memories.length, 20)
      };
    } catch (error) {
      console.error('Error generating collection suggestions:', error);
      throw new Error('Failed to generate collection suggestions');
    }
  }

  /**
   * Generate productivity insights based on memory patterns
   */
  async generateProductivityInsights(memories) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    const recentMemories = memories.filter(m => 
      new Date(m.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const analysisPrompt = `
Analyze these memory creation patterns and provide productivity insights:

Total memories: ${memories.length}
Recent memories (30 days): ${recentMemories.length}
Categories used: ${[...new Set(memories.map(m => m.category))].length}
Tags used: ${[...new Set(memories.flatMap(m => m.tags || []))].length}
Favorites: ${memories.filter(m => m.isFavorite).length}

Sample recent memories:
${recentMemories.slice(0, 5).map(m => `- ${m.title}: ${m.content.substring(0, 100)}...`).join('\n')}

Provide insights about:
1. Memory creation patterns
2. Areas of focus
3. Productivity trends
4. Recommendations for improvement

Format as JSON:
{
  "recommendations": ["recommendation1", "recommendation2"],
  "growthAreas": ["area1", "area2"],
  "patterns": ["pattern1", "pattern2"]
}
`;

    try {
      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback insights
      return {
        recommendations: [
          'Consider setting daily memory goals to maintain consistency',
          'Try using templates for common memory types',
          'Review and favorite your most important memories regularly'
        ],
        growthAreas: [
          'Increase categorization for better organization',
          'Add more detailed tags to improve searchability'
        ],
        patterns: [
          `You've created ${recentMemories.length} memories in the last 30 days`,
          `Your most active category appears to be ${this.getMostFrequentCategory(memories)}`
        ]
      };
    } catch (error) {
      console.error('Error generating productivity insights:', error);
      throw new Error('Failed to generate productivity insights');
    }
  }

  /**
   * Generate memory templates based on user's writing patterns
   */
  async generatePersonalizedTemplates(memories) {
    if (!this.isConfigured) {
      throw new Error('AI service not configured');
    }

    const sampleMemories = memories.slice(0, 10);
    
    const templatePrompt = `
Based on these memory examples, create 2-3 personalized templates that match the user's writing style:

${sampleMemories.map(m => `Title: ${m.title}\nContent: ${m.content}`).join('\n\n')}

Create templates that:
1. Match the user's typical structure and style
2. Include placeholder text that guides content creation
3. Are practical for the user's common themes

Format as JSON array:
[
  {
    "name": "Template Name",
    "description": "Template description",
    "structure": "Template with {placeholders}"
  }
]
`;

    try {
      const result = await this.model.generateContent(templatePrompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      console.error('Error generating personalized templates:', error);
      return [];
    }
  }

  buildMemoryContext(memories) {
    return memories
      .slice(0, 10) // Limit to prevent token overflow
      .map(memory => {
        const date = new Date(memory.createdAt).toLocaleDateString();
        const tags = memory.tags?.join(', ') || 'none';
        
        return `
Title: ${memory.title}
Date: ${date}
Category: ${memory.category || 'none'}
Tags: ${tags}
Content: ${memory.content}
---`;
      })
      .join('\n');
  }

  async testConnection() {
    try {
      await this.ensureInitialized();
      
      const result = await this.model.generateContent('Say "Hello, RecallRift!" to test the connection.');
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('AI connection test failed:', error);
      throw error;
    }
  }

  // Helper methods for analysis
  analyzeCategoryPatterns(memories) {
    const categories = {};
    memories.forEach(m => {
      if (m.category) {
        categories[m.category] = (categories[m.category] || 0) + 1;
      }
    });
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);
  }

  analyzeTagPatterns(memories) {
    const tags = {};
    memories.forEach(m => {
      if (m.tags) {
        m.tags.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tags)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  analyzeContentPatterns(memories) {
    // Simple content analysis - in a real app, you'd use more sophisticated NLP
    const commonWords = {};
    memories.forEach(m => {
      const words = m.content.toLowerCase().split(/\s+/)
        .filter(word => word.length > 4)
        .filter(word => !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'would', 'could', 'should'].includes(word));
      
      words.forEach(word => {
        commonWords[word] = (commonWords[word] || 0) + 1;
      });
    });
    
    return Object.entries(commonWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  getMostFrequentCategory(memories) {
    const categories = {};
    memories.forEach(m => {
      if (m.category) {
        categories[m.category] = (categories[m.category] || 0) + 1;
      }
    });
    
    const sorted = Object.entries(categories).sort(([,a], [,b]) => b - a);
    return sorted.length > 0 ? sorted[0][0] : 'Personal';
  }
}

export const aiService = new AIService();
export default aiService;
