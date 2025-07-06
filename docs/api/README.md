# API Reference

This directory contains comprehensive API documentation for all RecallRift services and components.

## Service APIs

### Core Services
- **[Database Service](./database.md)** - IndexedDB/Dexie operations for data persistence
- **[AI Service](./ai-service.md)** - Google Gemini integration for AI features
- **[Notification Service](./notification-service.md)** - In-app notification system

### Component APIs
- **[Memory Components](./components.md)** - Memory-related React components
- **[UI Components](./ui-components.md)** - Reusable UI components
- **[Form Components](./form-components.md)** - Form and input components

### Utility APIs
- **[Search & Filter](./search-filter.md)** - Search and filtering utilities
- **[Data Export/Import](./data-management.md)** - Data management operations
- **[Analytics](./analytics.md)** - Analytics and metrics collection

## Quick Reference

### Common Operations

#### Memory Management
```javascript
// Create memory
const memory = await addMemory({
  title: "My Memory",
  content: "Memory content",
  category: "Personal",
  tags: ["important"]
});

// Search memories
const results = await searchMemories("search query");

// Update memory
await updateMemory(memory.id, { title: "Updated Title" });
```

#### AI Integration
```javascript
// Analyze memory
const analysis = await analyzeMemory(memory);

// Chat with AI
const response = await sendMessage("What did I learn?", memories);

// Generate summary
const summary = await summarizeMemory(memory);
```

#### Notifications
```javascript
// Show notifications
showSuccess("Operation completed!");
showError("Something went wrong");
showWarning("Please confirm this action");
```

## Error Handling

All API methods use consistent error handling patterns:

```javascript
try {
  const result = await apiMethod(params);
  return result;
} catch (error) {
  console.error('API Error:', error);
  showError(error.message);
  throw error;
}
```

## Response Formats

### Standard Response
```javascript
{
  success: true,
  data: {}, // Response data
  message: "Operation completed successfully"
}
```

### Error Response
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable error message",
    details: {} // Additional error details
  }
}
```

## Authentication & Security

- All data is stored locally using IndexedDB
- API keys are stored securely in local settings
- No external authentication required
- Privacy-first approach with local-only data

## Rate Limiting

- AI service implements intelligent rate limiting
- Automatic retry with exponential backoff
- Request queuing for high-volume operations
- Graceful degradation when limits are reached

## TypeScript Support

All APIs include TypeScript definitions for better development experience:

```typescript
interface Memory {
  id?: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  aiSummary?: string;
  aiTags?: string[];
}

interface AIAnalysis {
  summary: string;
  suggestedTags: string[];
  category: string;
  keyTopics: string[];
  importance: number;
}
```

## Testing

All APIs include comprehensive test coverage:

```javascript
// Example test
describe('Database API', () => {
  it('should create and retrieve memory', async () => {
    const memory = await addMemory(testMemory);
    expect(memory.id).toBeDefined();
    
    const retrieved = await getMemory(memory.id);
    expect(retrieved.title).toBe(testMemory.title);
  });
});
```

## Migration Guide

When upgrading to new API versions:

1. Check the [CHANGELOG](../../CHANGELOG.md) for breaking changes
2. Update method calls according to new signatures
3. Test thoroughly in development environment
4. Monitor for deprecation warnings

## Contributing

To contribute to the API documentation:

1. Follow the existing format and style
2. Include comprehensive examples
3. Document all parameters and return values
4. Add error scenarios and handling
5. Update this index when adding new API docs

## Support

For API-related questions:
- Check the documentation first
- Look at example usage in the codebase
- Create an issue on GitHub with specific questions
- Include code examples when asking for help
