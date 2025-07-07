# Database API Reference

The Database API provides methods for storing and retrieving memories, user settings, and analytics data using IndexedDB with Dexie.

## Database Schema

### Tables

#### memories
- **id**: Primary key (auto-increment)
- **title**: String - Memory title
- **content**: String - Memory content
- **category**: String - Category classification
- **tags**: Array - Associated tags
- **isFavorite**: Boolean - Favorite status
- **createdAt**: Date - Creation timestamp
- **updatedAt**: Date - Last modification timestamp
- **aiSummary**: String - AI-generated summary
- **aiTags**: Array - AI-suggested tags
- **templateId**: String - Associated template ID
- **collectionIds**: Array - Smart collection IDs

#### settings
- **key**: Primary key (String)
- **value**: Any - Setting value

#### analytics
- **id**: Primary key (auto-increment)
- **event**: String - Event type
- **timestamp**: Date - Event timestamp
- **metadata**: Object - Additional event data

## API Methods

### Memory Operations

#### `addMemory(memory)`
Adds a new memory to the database.

**Parameters:**
- `memory` (Object): Memory object containing title, content, category, tags, etc.

**Returns:**
- Promise resolving to the created memory with assigned ID

**Example:**
```javascript
const memory = await addMemory({
  title: "Important Meeting",
  content: "Discussed project timeline and deliverables",
  category: "Work",
  tags: ["meeting", "project"],
  isFavorite: false
});
```

#### `getMemories()`
Retrieves all memories from the database.

**Returns:**
- Promise resolving to array of all memories

#### `getMemory(id)`
Retrieves a specific memory by ID.

**Parameters:**
- `id` (Number): Memory ID

**Returns:**
- Promise resolving to memory object or undefined

#### `updateMemory(id, updates)`
Updates an existing memory.

**Parameters:**
- `id` (Number): Memory ID
- `updates` (Object): Fields to update

**Returns:**
- Promise resolving to updated memory count

#### `deleteMemory(id)`
Deletes a memory by ID.

**Parameters:**
- `id` (Number): Memory ID

**Returns:**
- Promise resolving to deletion count

### Settings Operations

#### `getSetting(key)`
Retrieves a setting value by key.

**Parameters:**
- `key` (String): Setting key

**Returns:**
- Promise resolving to setting value or undefined

#### `setSetting(key, value)`
Sets a setting value.

**Parameters:**
- `key` (String): Setting key
- `value` (Any): Setting value

**Returns:**
- Promise resolving to setting object

### Analytics Operations

#### `addAnalyticsEvent(event, metadata)`
Records an analytics event.

**Parameters:**
- `event` (String): Event type
- `metadata` (Object): Additional event data

**Returns:**
- Promise resolving to created analytics record

#### `getAnalyticsData()`
Retrieves all analytics data.

**Returns:**
- Promise resolving to array of analytics records

#### `getAnalyticsSummary()`
Generates analytics summary with key metrics.

**Returns:**
- Promise resolving to analytics summary object

### Search Operations

#### `searchMemories(query)`
Performs full-text search on memories.

**Parameters:**
- `query` (String): Search query

**Returns:**
- Promise resolving to array of matching memories

#### `getMemoriesByCategory(category)`
Retrieves memories by category.

**Parameters:**
- `category` (String): Category name

**Returns:**
- Promise resolving to array of memories in category

#### `getMemoriesByTag(tag)`
Retrieves memories by tag.

**Parameters:**
- `tag` (String): Tag name

**Returns:**
- Promise resolving to array of memories with tag

#### `getFavoriteMemories()`
Retrieves all favorite memories.

**Returns:**
- Promise resolving to array of favorite memories

## Database Initialization

The database is automatically initialized when the module is imported. It creates the necessary tables and indexes for optimal performance.

## Error Handling

All database operations return promises and should be wrapped in try-catch blocks for proper error handling:

```javascript
try {
  const memory = await addMemory(memoryData);
  console.log('Memory created:', memory);
} catch (error) {
  console.error('Failed to create memory:', error);
}
```

## Migration and Versioning

The database schema is versioned and will automatically migrate when the structure changes. Data integrity is maintained during migrations.
