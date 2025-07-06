# AI Service API Reference

The AI Service provides integration with Google Gemini for various AI-powered features including chat, memory analysis, and content generation.

## Configuration

### API Key Setup
Set your Google Gemini API key in the settings:
```javascript
await setSetting('geminiApiKey', 'your-api-key-here');
```

### Model Configuration
The service uses the `gemini-1.5-flash` model by default for optimal performance and cost efficiency.

## API Methods

### Chat Operations

#### `sendMessage(message, memories)`
Sends a message to the AI with optional memory context.

**Parameters:**
- `message` (String): User message
- `memories` (Array): Array of relevant memories for context

**Returns:**
- Promise resolving to AI response string

**Example:**
```javascript
const response = await sendMessage(
  "What did I learn about React hooks?",
  relevantMemories
);
```

### Memory Analysis

#### `analyzeMemory(memory)`
Analyzes a memory and generates AI insights.

**Parameters:**
- `memory` (Object): Memory object with title and content

**Returns:**
- Promise resolving to analysis object:
  ```javascript
  {
    summary: "AI-generated summary",
    suggestedTags: ["tag1", "tag2"],
    category: "suggested-category",
    keyTopics: ["topic1", "topic2"],
    importance: 0.8 // 0-1 scale
  }
  ```

#### `summarizeMemory(memory)`
Generates a concise summary of a memory.

**Parameters:**
- `memory` (Object): Memory object

**Returns:**
- Promise resolving to summary string

#### `suggestTags(memory)`
Suggests relevant tags for a memory.

**Parameters:**
- `memory` (Object): Memory object

**Returns:**
- Promise resolving to array of suggested tags

### Content Generation

#### `generateTemplate(type, description)`
Generates a memory template based on type and description.

**Parameters:**
- `type` (String): Template type (e.g., "meeting", "learning", "project")
- `description` (String): Template description

**Returns:**
- Promise resolving to template object:
  ```javascript
  {
    name: "Template Name",
    description: "Template description",
    fields: [
      { name: "field1", type: "text", required: true },
      { name: "field2", type: "textarea", required: false }
    ],
    defaultTags: ["tag1", "tag2"],
    category: "suggested-category"
  }
  ```

#### `generateProductivityInsights(memories, timeframe)`
Generates productivity insights from memories.

**Parameters:**
- `memories` (Array): Array of memories to analyze
- `timeframe` (String): Time period ("week", "month", "quarter")

**Returns:**
- Promise resolving to insights object:
  ```javascript
  {
    patterns: ["pattern1", "pattern2"],
    recommendations: ["rec1", "rec2"],
    trends: {
      productivity: 0.8,
      learning: 0.7,
      focus_areas: ["area1", "area2"]
    },
    metrics: {
      total_memories: 100,
      categories_used: 5,
      average_quality: 0.75
    }
  }
  ```

### Smart Collections

#### `generateSmartCollection(query, type)`
Generates a smart collection based on query and type.

**Parameters:**
- `query` (String): Collection query/description
- `type` (String): Collection type ("ai" or "manual")

**Returns:**
- Promise resolving to smart collection object:
  ```javascript
  {
    name: "Collection Name",
    description: "Collection description",
    query: "search query",
    filters: {
      categories: ["cat1", "cat2"],
      tags: ["tag1", "tag2"],
      dateRange: "last-month"
    },
    criteria: "AI-generated criteria"
  }
  ```

### Pattern Recognition

#### `findPatterns(memories)`
Identifies patterns in memory data.

**Parameters:**
- `memories` (Array): Array of memories to analyze

**Returns:**
- Promise resolving to patterns object:
  ```javascript
  {
    temporal: ["pattern1", "pattern2"],
    thematic: ["theme1", "theme2"],
    behavioral: ["behavior1", "behavior2"],
    confidence: 0.85
  }
  ```

#### `discoverRelationships(memories)`
Discovers relationships between memories.

**Parameters:**
- `memories` (Array): Array of memories to analyze

**Returns:**
- Promise resolving to relationships array:
  ```javascript
  [
    {
      type: "topical",
      memories: [id1, id2],
      strength: 0.9,
      description: "Both memories discuss React development"
    }
  ]
  ```

#### `getPersonalizedRecommendations(userProfile, memories)`
Generates personalized recommendations based on user profile and memories.

**Parameters:**
- `userProfile` (Object): User profile with preferences and history
- `memories` (Array): User's memories

**Returns:**
- Promise resolving to recommendations object:
  ```javascript
  {
    actions: ["action1", "action2"],
    content: ["content1", "content2"],
    learning: ["topic1", "topic2"],
    priority: 0.8
  }
  ```

## Error Handling

All AI service methods include proper error handling:

```javascript
try {
  const response = await sendMessage(message, memories);
  return response;
} catch (error) {
  if (error.message.includes('API_KEY_NOT_CONFIGURED')) {
    // Handle missing API key
  } else if (error.message.includes('API_REQUEST_FAILED')) {
    // Handle API request failure
  }
  throw error;
}
```

## Rate Limiting

The service implements intelligent rate limiting to avoid API quota issues:
- Automatic retry with exponential backoff
- Request queuing for high-volume operations
- Graceful degradation when limits are reached

## Privacy and Security

- API keys are stored securely in local settings
- All data processing happens locally before sending to AI
- No sensitive information is logged or transmitted unnecessarily
- Users can disable AI features completely if desired

## Performance Optimization

- Efficient prompt engineering for faster responses
- Caching of repeated requests
- Batch processing for multiple operations
- Minimal data transmission to reduce latency
