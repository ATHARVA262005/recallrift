import React from 'react';
import { 
  Heart, 
  Edit3, 
  Trash2, 
  Calendar, 
  Tag, 
  Folder,
  MoreVertical 
} from 'lucide-react';
import { format } from 'date-fns';

const MemoryCard = ({ memory, onEdit, onDelete, onToggleFavorite }) => {
  const [showActions, setShowActions] = React.useState(false);

  const handleEdit = () => {
    onEdit(memory);
    setShowActions(false);
  };

  const handleDelete = () => {
    onDelete(memory.id);
    setShowActions(false);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(memory.id);
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">
            {memory.title}
          </h3>
          
          <div className="flex items-center space-x-1">
            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`p-1 rounded-md transition-colors ${
                memory.isFavorite
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart 
                className={`h-4 w-4 ${memory.isFavorite ? 'fill-current' : ''}`} 
              />
            </button>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10 min-w-[120px]">
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {truncateContent(memory.content)}
        </p>
      </div>

      {/* Tags */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-1">
            {memory.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {memory.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                +{memory.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            {/* Category */}
            {memory.category && (
              <div className="flex items-center space-x-1">
                <Folder className="h-3 w-3" />
                <span>{memory.category}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(memory.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Updated indicator */}
          {memory.updatedAt && memory.updatedAt !== memory.createdAt && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Updated {format(new Date(memory.updatedAt), 'MMM d')}
            </div>
          )}
        </div>
      </div>

      {/* Click overlay to close actions menu */}
      {showActions && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default MemoryCard;
