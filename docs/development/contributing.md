# Contributing to RecallRift

Thank you for your interest in contributing to RecallRift! This guide will help you get started with contributing to our local-first, AI-powered second brain application.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites
Before contributing, make sure you have:
- Node.js 18 or higher
- npm 9 or higher
- Git
- A GitHub account
- Basic knowledge of React, JavaScript, and modern web development

### Understanding the Project
RecallRift is a local-first application that helps users organize and interact with their memories using AI. Key features include:
- **Local Storage**: All data stored locally using IndexedDB
- **AI Integration**: Google Gemini for intelligent features
- **Privacy-First**: No external data transmission except for AI features
- **Offline Support**: Full functionality without internet connection

### Project Structure
```
recallrift/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # Business logic and API services
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
├── docs/              # Documentation
├── tests/             # Test files
└── public/            # Public assets
```

## Development Setup

### 1. Fork and Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/recallrift.git
cd recallrift/recallrift

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/recallrift.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
Create a `.env.local` file for local development:
```
VITE_AI_API_KEY=your-gemini-api-key-here
VITE_ENVIRONMENT=development
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 5. Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Contribution Guidelines

### Types of Contributions
We welcome various types of contributions:

1. **Bug Reports**: Help us identify and fix issues
2. **Feature Requests**: Suggest new features or improvements
3. **Code Contributions**: Fix bugs or implement new features
4. **Documentation**: Improve or add documentation
5. **Testing**: Add or improve tests
6. **Performance**: Optimize performance
7. **Accessibility**: Improve accessibility features

### Before You Start
1. **Check existing issues**: Look for existing issues or discussions
2. **Create an issue**: For significant changes, create an issue first
3. **Discuss your approach**: Get feedback on your proposed solution
4. **Start small**: Begin with small, focused contributions

### Development Workflow
1. **Create a branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**: Implement your changes following our code style
3. **Test thoroughly**: Ensure all tests pass and add new tests if needed
4. **Commit changes**: Use conventional commit messages
5. **Push and create PR**: Push your branch and create a pull request

## Code Style

### JavaScript/React Standards
- Use **ES6+** features
- Follow **React best practices**
- Use **functional components** with hooks
- Implement **proper error handling**
- Write **descriptive variable names**

### Code Formatting
We use ESLint and Prettier for consistent code formatting:
```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Component Structure
```javascript
// Good component structure
import React, { useState, useEffect } from 'react';
import { componentStyles } from './Component.styles';

const Component = ({ prop1, prop2, onEvent }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleEvent = (event) => {
    // Event handling
    onEvent?.(event);
  };

  return (
    <div className={componentStyles.container}>
      {/* Component content */}
    </div>
  );
};

export default Component;
```

### Service Structure
```javascript
// Good service structure
class ServiceName {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    // Initialization logic
    this.initialized = true;
  }

  async methodName(parameters) {
    try {
      await this.initialize();
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

### Error Handling
```javascript
// Consistent error handling
const handleAsyncOperation = async () => {
  try {
    const result = await riskyOperation();
    showNotification('Operation successful', 'success');
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    showNotification(`Operation failed: ${error.message}`, 'error');
    throw error;
  }
};
```

## Pull Request Process

### PR Preparation
1. **Update your branch**: Sync with upstream main
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/your-feature-name
   git rebase main
   ```

2. **Test thoroughly**: Ensure all tests pass
   ```bash
   npm test
   npm run build
   ```

3. **Update documentation**: Update relevant documentation
4. **Write good commit messages**: Follow conventional commits

### PR Template
When creating a PR, include:
- **Description**: Clear description of changes
- **Type**: Bug fix, feature, documentation, etc.
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes
- **Breaking changes**: Any breaking changes
- **Related issues**: Link to related issues

### PR Example
```markdown
## Description
Add fuzzy search functionality to improve search experience

## Type
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [x] Unit tests added/updated
- [x] Integration tests pass
- [x] Manual testing completed

## Screenshots
[Include screenshots for UI changes]

## Related Issues
Closes #123
```

### Review Process
1. **Automated checks**: Ensure all CI checks pass
2. **Code review**: Address reviewer feedback
3. **Testing**: Verify functionality works as expected
4. **Documentation**: Ensure documentation is updated
5. **Merge**: Maintainer will merge after approval

## Issue Guidelines

### Bug Reports
Use the bug report template and include:
- **Environment**: OS, browser, version
- **Steps to reproduce**: Clear reproduction steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: Visual evidence if applicable
- **Additional context**: Any other relevant information

### Feature Requests
Use the feature request template and include:
- **Problem**: What problem does this solve
- **Solution**: Proposed solution
- **Alternatives**: Alternative solutions considered
- **Use cases**: How would this be used
- **Priority**: How important is this feature

### Question/Discussion
For questions or discussions:
- **Search first**: Check if already discussed
- **Be specific**: Provide context and details
- **Be respectful**: Follow community guidelines
- **Tag appropriately**: Use relevant labels

## Community Guidelines

### Code of Conduct
We are committed to providing a welcoming and inclusive environment. Please read and follow our [Code of Conduct](../CODE_OF_CONDUCT.md).

### Communication
- **Be respectful**: Treat everyone with respect
- **Be constructive**: Provide helpful feedback
- **Be patient**: Everyone is learning
- **Be inclusive**: Welcome newcomers

### Getting Help
- **Documentation**: Check the documentation first
- **Issues**: Search existing issues
- **Discussions**: Join community discussions
- **Discord**: Real-time chat (if available)

## Specific Contribution Areas

### AI Features
When contributing AI features:
- **Privacy first**: Ensure user data privacy
- **Graceful degradation**: Work without AI when needed
- **Error handling**: Handle AI service failures
- **User control**: Let users control AI features

### UI/UX
When contributing UI/UX:
- **Accessibility**: Follow WCAG guidelines
- **Responsive design**: Work on all screen sizes
- **Consistent styling**: Follow design system
- **User feedback**: Provide clear feedback

### Database
When contributing database features:
- **Data integrity**: Ensure data consistency
- **Performance**: Optimize queries
- **Migration**: Handle schema changes
- **Backup**: Consider data backup needs

### Performance
When contributing performance improvements:
- **Measure first**: Profile before optimizing
- **Real-world testing**: Test with realistic data
- **Memory usage**: Monitor memory consumption
- **Bundle size**: Keep bundle size minimal

## Testing Guidelines

### Unit Tests
- **Test behavior**: Test what the code does, not how
- **Use descriptive names**: Clear test descriptions
- **Mock external dependencies**: Isolate units under test
- **Test edge cases**: Include error scenarios

### Integration Tests
- **Test interactions**: Test component interactions
- **Use realistic data**: Test with realistic scenarios
- **Test error paths**: Include error handling
- **Test async operations**: Handle promises correctly

### E2E Tests
- **Test user workflows**: Test complete user journeys
- **Use page objects**: Organize tests with page objects
- **Test critical paths**: Focus on important features
- **Keep tests stable**: Avoid flaky tests

## Release Process

### Versioning
We use semantic versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

### Changelog
Update `CHANGELOG.md` with:
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

## Recognition

### Contributors
Contributors are recognized in:
- **README**: Contributors section
- **Changelog**: Feature credits
- **Release notes**: Major contribution recognition
- **Community**: Shoutouts in community channels

### Becoming a Maintainer
Regular contributors may be invited to become maintainers based on:
- **Consistent contributions**: Regular, quality contributions
- **Community involvement**: Helping other contributors
- **Technical expertise**: Deep understanding of the codebase
- **Alignment**: Alignment with project goals

Thank you for contributing to RecallRift! Your contributions help make this project better for everyone. 🚀
