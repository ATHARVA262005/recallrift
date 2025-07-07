# 🚀 Installation Guide

This guide will help you set up RecallRift on your local machine for development or personal use.

## 📋 **Prerequisites**

### **Required**
- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Modern Browser** with IndexedDB support:
  - Chrome/Chromium 80+
  - Firefox 75+
  - Safari 13+
  - Edge 80+

### **Optional**
- **Google Gemini API Key** for AI features ([Get API Key](https://aistudio.google.com/app/apikey))
- **Git** for version control ([Download](https://git-scm.com/))

## 🔧 **Installation Steps**

### **1. Clone the Repository**
```bash
# Using HTTPS
git clone https://github.com/ATHARVA262005/recallrift.git

# Or using SSH
git clone git@github.com:ATHARVA262005/recallrift.git

# Navigate to the project directory
cd recallrift/recallrift
```

### **2. Install Dependencies**
```bash
# Install all required packages
npm install

# Verify installation
npm list --depth=0
```

### **3. Environment Setup**
```bash
# Create environment file (optional)
cp .env.example .env

# Edit environment variables if needed
# Note: RecallRift works without environment variables
```

### **4. Start Development Server**
```bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:5174
```

### **5. Verify Installation**
1. Open your browser and navigate to `http://localhost:5174`
2. You should see the RecallRift welcome screen
3. Try creating your first memory to verify everything works

## 🤖 **AI Features Setup (Optional)**

To enable AI-powered features like semantic search and auto-summarization:

### **1. Get Gemini API Key**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the generated key

### **2. Configure API Key**
1. Open RecallRift in your browser
2. Navigate to **Settings** → **AI Configuration**
3. Paste your API key in the "Gemini API Key" field
4. Click **Save**
5. You should see "AI Enabled" status in the chat interface

### **3. Test AI Features**
- Try semantic search in the Chat interface
- Use AI tag suggestions when creating memories
- Generate AI summaries for long memories

## 📦 **Production Build**

To create a production-ready build:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# The build files will be in the 'dist' directory
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Port 5174 Already in Use**
```bash
# The dev server will automatically try port 5175, 5176, etc.
# Or specify a different port:
npm run dev -- --port 3000
```

#### **Node Version Issues**
```bash
# Check your Node.js version
node --version

# Should be 18.0 or higher
# Use nvm to manage Node.js versions if needed
```

#### **Dependencies Installation Fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Browser Compatibility**
- Ensure you're using a modern browser
- IndexedDB must be available (check dev tools)
- Disable any browser extensions that might interfere

### **AI Features Not Working**
1. **Check API Key**: Verify it's correctly entered in Settings
2. **Network Connection**: Ensure you have internet access
3. **API Limits**: Check if you've exceeded free tier limits
4. **Browser Console**: Look for error messages in dev tools

## 🖥️ **System Requirements**

### **Minimum Requirements**
- **RAM**: 4GB
- **Storage**: 100MB free space
- **Processor**: Dual-core 2GHz
- **Internet**: Required only for AI features

### **Recommended Requirements**
- **RAM**: 8GB or more
- **Storage**: 1GB free space
- **Processor**: Quad-core 2.5GHz or better
- **Internet**: Stable broadband for optimal AI performance

## 📁 **Project Structure**
```
recallrift/
├── recallrift/                 # Main application directory
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # Business logic
│   │   └── assets/           # Static assets
│   ├── public/               # Public assets
│   ├── package.json          # Dependencies
│   └── vite.config.js        # Build configuration
├── docs/                     # Documentation
└── README.md                 # Project overview
```

## 🔧 **Development Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint:fix
```

## 🌐 **Browser-Specific Notes**

### **Chrome/Chromium** (Recommended)
- Best performance and feature support
- Full IndexedDB capabilities
- Optimal AI integration

### **Firefox**
- Good performance and compatibility
- All features supported
- May have slightly slower IndexedDB operations

### **Safari**
- Supported on macOS and iOS
- Some IndexedDB limitations on older versions
- AI features work but may be slower

### **Edge**
- Full compatibility with Chromium-based Edge
- All features supported
- Performance similar to Chrome

## 🔐 **Privacy & Security**

- **Local-First**: All data stored locally in your browser
- **No Server**: No data sent to external servers (except AI features)
- **API Key Security**: Gemini API key stored locally, never transmitted
- **Offline Capable**: Core features work without internet connection

## 📞 **Getting Help**

If you encounter issues during installation:

1. **Check Documentation**: Review this guide and the [Troubleshooting](./TROUBLESHOOTING.md) section
2. **Search Issues**: Look through [GitHub Issues](https://github.com/ATHARVA262005/recallrift/issues)
3. **Create Issue**: If you can't find a solution, create a new issue with:
   - Your operating system and version
   - Node.js and npm versions
   - Browser name and version
   - Complete error messages
   - Steps to reproduce the problem

## ✅ **Installation Checklist**

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed with `npm install`
- [ ] Development server starts with `npm run dev`
- [ ] Application loads at `http://localhost:5174`
- [ ] Can create and save a test memory
- [ ] AI features configured (optional)
- [ ] All features working as expected

---

**Next Steps**: Once installed, check out the [Quick Start Guide](./QUICK_START.md) to begin using RecallRift!
