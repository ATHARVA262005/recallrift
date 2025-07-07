# Notification Service API Reference

The Notification Service provides a centralized system for managing in-app notifications and user alerts.

## Overview

The notification service handles various types of notifications including success messages, errors, warnings, and informational alerts. It supports both temporary and persistent notifications with customizable styling and behavior.

## API Methods

### Core Notification Methods

#### `showNotification(message, type, options)`
Displays a notification to the user.

**Parameters:**
- `message` (String): The notification message
- `type` (String): Notification type - "success", "error", "warning", "info"
- `options` (Object, optional): Additional configuration options

**Options:**
```javascript
{
  duration: 3000,        // Auto-dismiss time in milliseconds (0 for persistent)
  persistent: false,     // Whether notification persists across page reloads
  id: "unique-id",      // Unique identifier for the notification
  actions: [            // Action buttons
    {
      label: "Undo",
      action: () => {},
      style: "primary"
    }
  ]
}
```

**Returns:**
- String: Notification ID for tracking

**Example:**
```javascript
const notificationId = showNotification(
  "Memory saved successfully!",
  "success",
  { duration: 2000 }
);
```

#### `showSuccess(message, options)`
Convenience method for success notifications.

**Parameters:**
- `message` (String): Success message
- `options` (Object, optional): Additional options

**Returns:**
- String: Notification ID

#### `showError(message, options)`
Convenience method for error notifications.

**Parameters:**
- `message` (String): Error message
- `options` (Object, optional): Additional options

**Returns:**
- String: Notification ID

#### `showWarning(message, options)`
Convenience method for warning notifications.

**Parameters:**
- `message` (String): Warning message
- `options` (Object, optional): Additional options

**Returns:**
- String: Notification ID

#### `showInfo(message, options)`
Convenience method for informational notifications.

**Parameters:**
- `message` (String): Info message
- `options` (Object, optional): Additional options

**Returns:**
- String: Notification ID

### Notification Management

#### `dismissNotification(id)`
Dismisses a specific notification.

**Parameters:**
- `id` (String): Notification ID

**Returns:**
- Boolean: Success status

#### `dismissAll()`
Dismisses all active notifications.

**Returns:**
- Number: Count of dismissed notifications

#### `getActiveNotifications()`
Retrieves all currently active notifications.

**Returns:**
- Array: List of active notification objects

#### `clearHistory()`
Clears the notification history.

**Returns:**
- Boolean: Success status

### Persistent Notifications

#### `addPersistentNotification(message, type, options)`
Adds a persistent notification that survives page reloads.

**Parameters:**
- `message` (String): Notification message
- `type` (String): Notification type
- `options` (Object, optional): Additional options

**Returns:**
- String: Notification ID

#### `removePersistentNotification(id)`
Removes a persistent notification.

**Parameters:**
- `id` (String): Notification ID

**Returns:**
- Boolean: Success status

### Notification Queuing

#### `queueNotification(notification)`
Adds a notification to the queue for delayed display.

**Parameters:**
- `notification` (Object): Notification configuration

**Returns:**
- String: Queue ID

#### `processQueue()`
Processes all queued notifications.

**Returns:**
- Number: Count of processed notifications

## Notification Types

### Success Notifications
- **Color**: Green
- **Icon**: Checkmark
- **Default Duration**: 3 seconds
- **Use Case**: Successful operations (save, delete, update)

### Error Notifications
- **Color**: Red
- **Icon**: X or Warning
- **Default Duration**: 5 seconds
- **Use Case**: Failed operations, validation errors

### Warning Notifications
- **Color**: Orange/Yellow
- **Icon**: Warning triangle
- **Default Duration**: 4 seconds
- **Use Case**: Potential issues, confirmations needed

### Info Notifications
- **Color**: Blue
- **Icon**: Info circle
- **Default Duration**: 3 seconds
- **Use Case**: General information, tips, updates

## Event Handling

The notification service emits events that can be subscribed to:

```javascript
// Listen for notification events
notificationService.on('notification:show', (notification) => {
  console.log('Notification shown:', notification);
});

notificationService.on('notification:dismiss', (id) => {
  console.log('Notification dismissed:', id);
});

notificationService.on('notification:action', (action, notificationId) => {
  console.log('Notification action triggered:', action, notificationId);
});
```

## Common Usage Patterns

### Memory Operations
```javascript
// Save memory
try {
  await saveMemory(memoryData);
  showSuccess("Memory saved successfully!");
} catch (error) {
  showError("Failed to save memory: " + error.message);
}
```

### Bulk Operations
```javascript
// Delete multiple memories
const deleteCount = await deleteSelectedMemories(selectedIds);
showSuccess(`${deleteCount} memories deleted`, {
  actions: [
    {
      label: "Undo",
      action: () => restoreDeletedMemories(),
      style: "secondary"
    }
  ]
});
```

### AI Operations
```javascript
// AI processing
showInfo("Analyzing memory with AI...", { duration: 0, id: 'ai-processing' });
try {
  const analysis = await analyzeMemory(memory);
  dismissNotification('ai-processing');
  showSuccess("AI analysis completed!");
} catch (error) {
  dismissNotification('ai-processing');
  showError("AI analysis failed: " + error.message);
}
```

### Import/Export Operations
```javascript
// Data export
const exportId = showInfo("Preparing export...", { duration: 0 });
try {
  const data = await exportData();
  dismissNotification(exportId);
  showSuccess("Data exported successfully!", {
    actions: [
      {
        label: "Download",
        action: () => downloadFile(data),
        style: "primary"
      }
    ]
  });
} catch (error) {
  dismissNotification(exportId);
  showError("Export failed: " + error.message);
}
```

## Configuration

### Global Settings
```javascript
// Configure default notification behavior
notificationService.configure({
  defaultDuration: 3000,
  maxNotifications: 5,
  position: 'top-right',
  animations: true,
  soundEnabled: false
});
```

### Theme Integration
Notifications automatically adapt to the current theme (light/dark mode) and respect user accessibility preferences.

## Best Practices

1. **Use appropriate types**: Match notification type to the action result
2. **Provide clear messages**: Be specific about what happened
3. **Include actions when relevant**: Offer undo, retry, or related actions
4. **Consider duration**: Longer for errors, shorter for successes
5. **Group related notifications**: Avoid spamming users with multiple notifications
6. **Test accessibility**: Ensure notifications work with screen readers
7. **Handle offline scenarios**: Queue notifications when offline

## Integration with Components

The notification service integrates seamlessly with React components through custom hooks:

```javascript
import { useNotifications } from '../hooks/useNotifications';

function MyComponent() {
  const { showSuccess, showError } = useNotifications();
  
  const handleSave = async () => {
    try {
      await saveData();
      showSuccess("Data saved!");
    } catch (error) {
      showError("Save failed: " + error.message);
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```
