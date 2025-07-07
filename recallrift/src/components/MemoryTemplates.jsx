import React, { useState } from 'react';
import { 
  FileText, 
  Lightbulb, 
  Target, 
  BookOpen, 
  Coffee,
  Calendar,
  CheckSquare,
  MessageSquare,
  Star,
  Zap
} from 'lucide-react';

const MemoryTemplates = ({ onSelectTemplate, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 'daily-reflection',
      name: 'Daily Reflection',
      description: 'Capture your daily thoughts and learnings',
      icon: Coffee,
      color: 'orange',
      category: 'Personal',
      template: {
        title: 'Daily Reflection - {date}',
        content: `What went well today:
- 

What could have been better:
- 

Key learnings:
- 

Tomorrow's priorities:
- `,
        tags: ['daily', 'reflection', 'personal'],
        category: 'Personal'
      }
    },
    {
      id: 'idea-capture',
      name: 'Idea Capture',
      description: 'Record sudden insights and creative thoughts',
      icon: Lightbulb,
      color: 'yellow',
      category: 'Ideas',
      template: {
        title: 'Idea: {title}',
        content: `💡 The Idea:


🎯 Why it matters:


📋 Next steps:
- 

🔗 Related thoughts:
- `,
        tags: ['idea', 'creative', 'innovation'],
        category: 'Ideas'
      }
    },
    {
      id: 'meeting-notes',
      name: 'Meeting Notes',
      description: 'Structured format for meeting documentation',
      icon: MessageSquare,
      color: 'blue',
      category: 'Work',
      template: {
        title: 'Meeting: {title}',
        content: `📅 Date: {date}
👥 Attendees: 

🎯 Objectives:
- 

📋 Key Discussion Points:
- 

✅ Action Items:
- [ ] 

🔄 Follow-up:
- `,
        tags: ['meeting', 'work', 'notes'],
        category: 'Work'
      }
    },
    {
      id: 'goal-setting',
      name: 'Goal Setting',
      description: 'Define and track your objectives',
      icon: Target,
      color: 'green',
      category: 'Goals',
      template: {
        title: 'Goal: {title}',
        content: `🎯 Goal Statement:


📊 Success Metrics:
- 

⏰ Timeline:
- Start: 
- Milestones: 
- End: 

💪 Action Plan:
- [ ] 

🚧 Potential Obstacles:
- 

🎉 Why this matters:
`,
        tags: ['goal', 'planning', 'productivity'],
        category: 'Goals'
      }
    },
    {
      id: 'learning-notes',
      name: 'Learning Notes',
      description: 'Capture knowledge and insights from learning',
      icon: BookOpen,
      color: 'purple',
      category: 'Learning',
      template: {
        title: 'Learning: {title}',
        content: `📚 Source: 

🔑 Key Concepts:
- 

💡 Personal Insights:
- 

🎯 Applications:
- 

📝 Questions to explore:
- 

🔗 Related topics:
- `,
        tags: ['learning', 'knowledge', 'education'],
        category: 'Learning'
      }
    },
    {
      id: 'project-planning',
      name: 'Project Planning',
      description: 'Structure your project ideas and plans',
      icon: CheckSquare,
      color: 'indigo',
      category: 'Projects',
      template: {
        title: 'Project: {title}',
        content: `📋 Project Overview:


🎯 Objectives:
- 

📊 Requirements:
- 

📅 Timeline:
- Phase 1: 
- Phase 2: 
- Phase 3: 

👥 Resources Needed:
- 

🚀 Success Criteria:
- `,
        tags: ['project', 'planning', 'work'],
        category: 'Projects'
      }
    }
  ];

  const handleTemplateSelect = (template) => {
    const now = new Date();
    const templateData = {
      ...template.template,
      title: template.template.title
        .replace('{date}', now.toLocaleDateString())
        .replace('{title}', ''),
      content: template.template.content
        .replace('{date}', now.toLocaleDateString())
    };

    onSelectTemplate(templateData);
    onClose();
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Memory Templates
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Choose a template to get started quickly
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-full bg-${template.color}-100 dark:bg-${template.color}-900 mr-3`}>
                        <template.icon className={`h-5 w-5 text-${template.color}-600 dark:text-${template.color}-400`} />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.template.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4 mr-1" />
              <span>Templates help you capture thoughts faster</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryTemplates;
