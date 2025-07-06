# Development Guide

This guide provides comprehensive information for developers working on RecallRift, including setup, architecture, and contribution guidelines.

## Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions

### Development Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/recallrift.git
   cd recallrift/recallrift
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:5173`

### Environment Configuration
Create a `.env.local` file for local development:
```
VITE_AI_API_KEY=your-gemini-api-key
VITE_ENVIRONMENT=development
VITE_DEBUG=true
```

## Project Structure

### Directory Layout
```
recallrift/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # Business logic and API services
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles
│   └── assets/             # Static assets
├── public/                 # Public assets
├── docs/                   # Documentation
├── tests/                  # Test files
└── package.json
```

### Key Files
- **`src/App.jsx`**: Main application component
- **`src/main.jsx`**: Application entry point
- **`src/services/database.js`**: Database operations
- **`src/services/aiService.js`**: AI integration
- **`vite.config.js`**: Build configuration

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 with Vite
- **Database**: IndexedDB with Dexie
- **AI**: Google Gemini API
- **UI**: Custom CSS with modern features
- **Search**: Fuse.js for fuzzy search
- **Icons**: Lucide React icons

### Component Architecture
```
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Main Content
├── Pages
│   ├── Home
│   ├── Chat
│   ├── Settings
│   └── Analytics
└── Components
    ├── MemoryCard
    ├── MemoryForm
    ├── AdvancedSearch
    └── ...
```

### Data Flow
1. **User Interaction** → Component Event Handler
2. **Component** → Service Layer (database.js, aiService.js)
3. **Service** → External API or Local Storage
4. **Response** → Component State Update
5. **State Change** → UI Re-render

## Development Workflow

### Code Style
- **ESLint**: Enforces coding standards
- **Prettier**: Code formatting
- **Conventional Commits**: Structured commit messages
- **Semantic Versioning**: Version numbering

### Git Workflow
1. **Feature Branch**: Create branch from main
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Development**: Make changes and commit
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and PR**: Push branch and create pull request
   ```bash
   git push origin feature/your-feature-name
   ```

### Testing Strategy
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Manual Testing**: Test in multiple browsers and devices

## Key Development Concepts

### State Management
- **Local State**: React useState for component state
- **Global State**: Context API for shared state
- **Persistent State**: IndexedDB for data persistence
- **Cache State**: Memory cache for performance

### Database Operations
```javascript
// Example database operations
import { addMemory, getMemories, updateMemory, deleteMemory } from './services/database';

// Create
const memory = await addMemory(memoryData);

// Read
const memories = await getMemories();

// Update
await updateMemory(id, updates);

// Delete
await deleteMemory(id);
```

### AI Integration
```javascript
// Example AI operations
import { analyzeMemory, sendMessage } from './services/aiService';

// Analyze memory
const analysis = await analyzeMemory(memory);

// Chat with AI
const response = await sendMessage(message, context);
```

### Error Handling
```javascript
// Standard error handling pattern
try {
  const result = await riskyOperation();
  showSuccess("Operation completed successfully");
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  showError(`Operation failed: ${error.message}`);
  throw error;
}
```

## Component Development

### Component Structure
```javascript
// Standard component structure
import React, { useState, useEffect } from 'react';
import { ComponentName } from './ComponentName.styles';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleEvent = () => {
    // Event handling
  };

  return (
    <ComponentName>
      {/* Component JSX */}
    </ComponentName>
  );
};

export default ComponentName;
```

### Custom Hooks
```javascript
// Example custom hook
import { useState, useEffect } from 'react';

const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const data = await getMemories();
        setMemories(data);
      } catch (error) {
        console.error('Failed to load memories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, []);

  return { memories, loading, setMemories };
};

export default useMemories;
```

## Service Development

### Service Structure
```javascript
// Example service structure
class ServiceName {
  constructor() {
    this.config = {};
  }

  async methodName(parameters) {
    try {
      // Service logic
      return result;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}

export default new ServiceName();
```

### API Integration
```javascript
// Example API integration
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};
```

## Testing

### Unit Testing
```javascript
// Example unit test
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    const mockHandler = jest.fn();
    render(<ComponentName onEvent={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Integration Testing
```javascript
// Example integration test
describe('Memory Management', () => {
  test('creates and displays memory', async () => {
    // Setup
    const memoryData = { title: 'Test Memory', content: 'Test content' };
    
    // Action
    await addMemory(memoryData);
    const memories = await getMemories();
    
    // Assertion
    expect(memories).toHaveLength(1);
    expect(memories[0].title).toBe('Test Memory');
  });
});
```

## Performance Optimization

### Code Splitting
```javascript
// Lazy loading components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### Memory Optimization
```javascript
// Memoization for expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Callback memoization
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Database Optimization
```javascript
// Efficient database queries
const memories = await db.memories
  .where('category')
  .equals('Learning')
  .and(memory => memory.tags.includes('react'))
  .limit(10)
  .toArray();
```

## Debugging

### Development Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State management debugging
- **Browser DevTools**: Network, performance, console
- **VS Code Debugger**: Breakpoint debugging

### Common Issues
1. **State Not Updating**: Check useEffect dependencies
2. **Memory Leaks**: Cleanup subscriptions and timers
3. **Performance Issues**: Profile and optimize renders
4. **API Errors**: Check network requests and error handling

### Logging
```javascript
// Development logging
const logger = {
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

## Build and Deployment

### Build Process
```bash
# Development build
npm run build

# Production build
npm run build -- --mode production

# Preview build
npm run preview
```

### Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
});
```

## Contributing Guidelines

### Code Quality
- **Write Tests**: Include tests for new features
- **Document Code**: Add JSDoc comments
- **Follow Patterns**: Use established patterns
- **Review Code**: Participate in code reviews

### Pull Request Process
1. **Branch Naming**: Use descriptive branch names
2. **Commit Messages**: Follow conventional commits
3. **Description**: Provide clear PR description
4. **Testing**: Ensure tests pass
5. **Review**: Address review feedback

### Release Process
1. **Version Bump**: Update version number
2. **Changelog**: Update CHANGELOG.md
3. **Testing**: Comprehensive testing
4. **Documentation**: Update documentation
5. **Release**: Create release tag

## Resources

### Documentation
- **React**: https://reactjs.org/docs
- **Vite**: https://vitejs.dev/guide
- **Dexie**: https://dexie.org/docs
- **Lucide Icons**: https://lucide.dev

### Tools
- **VS Code Extensions**: ESLint, Prettier, React snippets
- **Chrome Extensions**: React DevTools, Redux DevTools
- **Online Tools**: Regexr, JSON Formatter, Color Picker

### Community
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Discord**: Real-time chat with developers
- **Stack Overflow**: Technical questions and answers
