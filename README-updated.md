# 🧠 RecallRift

> "Chat with your past self. Recall thoughts, rants, decisions, and insights—instantly."

## 🚀 What is RecallRift?

RecallRift is your local-first, AI-powered second brain that lets you capture and recall your thoughts through a private, chat-based memory interface.

## ✨ Features

### 🎯 **Priority 1 Features (MVP)**
- **Memory Management**: Create, edit, delete, and organize your thoughts
- **Local Storage**: All data stored locally using IndexedDB for privacy
- **Search & Filter**: Find memories by title, content, tags, or category
- **Chat Interface**: Natural language interaction with your memories
- **Dark/Light Mode**: Toggle between themes
- **Categories & Tags**: Organize memories for easy retrieval
- **Export/Import**: Backup and restore your data
- **Responsive Design**: Works on desktop and mobile

### 🔮 **Coming Soon**
- **AI Integration**: Enhanced search using Gemini API
- **Advanced Analytics**: Memory insights and trends
- **Browser Extension**: Quick capture from anywhere
- **Multi-device Sync**: Optional cloud synchronization

## 🔧 Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: TailwindCSS 4
- **Database**: IndexedDB with Dexie
- **Icons**: Lucide React
- **Language**: JavaScript (JSX)
- **AI**: Gemini API (BYOK - Bring Your Own Key)

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/ATHARVA262005/recallrift.git

# Navigate to the project directory
cd recallrift/recallrift

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser to http://localhost:5173
```

## 🎮 Usage

1. **Add Memories**: Click the "Add Memory" button to capture your thoughts
2. **Search**: Use the search bar to find specific memories
3. **Chat**: Go to the Chat tab to ask questions about your memories
4. **Organize**: Use categories and tags to keep things organized
5. **Export**: Backup your data anytime from the Settings page

## 🏗️ Project Structure

```
recallrift/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx      # Main app layout
│   │   ├── MemoryCard.jsx  # Memory display component
│   │   └── MemoryForm.jsx  # Memory creation/editing form
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx        # Memory management page
│   │   ├── Chat.jsx        # Chat interface
│   │   └── Settings.jsx    # Settings and preferences
│   ├── services/           # Data layer
│   │   ├── database.js     # IndexedDB operations
│   │   └── seedData.js     # Demo data for testing
│   └── App.jsx             # Main app component
├── package.json
└── README.md
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** and test them
4. **Commit your changes**: `git commit -m "Add your feature"`
5. **Push to your fork**: `git push origin feature/your-feature`
6. **Create a Pull Request**

### 🎯 Good First Issues

Look for issues labeled with `good first issue` to get started:
- UI improvements
- Bug fixes
- Documentation updates
- Feature enhancements

## 🛠️ Development

```bash
# Run the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons
- **Dexie** for IndexedDB wrapper
- **Vite** for the fast build tool

---

**Created by Atharva Ralegankar** • [GitHub](https://github.com/ATHARVA262005)

*Happy remembering! 🧠✨*
