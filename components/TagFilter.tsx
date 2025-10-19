import React from 'react';

interface TagFilterProps {
  tags: { tag: string; count: number }[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onClearFilters: () => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagSelect, onClearFilters }) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2 items-center">
        <span className="font-medium text-slate-600 dark:text-slate-300 mr-2 text-sm">Top Tags:</span>
        {tags.map((item) => (
            <button
            key={item.tag}
            onClick={() => onTagSelect(item.tag)}
            className={`inline-flex items-center pl-3 pr-2 py-1 text-sm rounded-full transition-all duration-200 border ${
                selectedTags.includes(item.tag)
                ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            >
            {item.tag}
            <span className={`ml-2 text-xs font-mono rounded-full px-1.5 py-0.5 ${
                 selectedTags.includes(item.tag)
                 ? 'bg-white/20'
                 : 'bg-slate-100 dark:bg-slate-700'
            }`}>
                {item.count}
            </span>
            </button>
        ))}
        {selectedTags.length > 0 && (
            <button 
                onClick={onClearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline ml-2"
            >
                Clear Filters
            </button>
        )}
        </div>
    </div>
  );
};

export default TagFilter;