import React from 'react';
import { Workflow } from '../types';

interface WorkflowListItemProps {
  workflow: Workflow;
  onSelect: (workflow: Workflow) => void;
}

const WorkflowListItem: React.FC<WorkflowListItemProps> = ({ workflow, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(workflow)}
      className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-200 cursor-pointer p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex-grow">
        <h3 className="text-md font-semibold text-slate-900 dark:text-white">{workflow.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-1">
          {workflow.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 flex-shrink-0 pt-2 sm:pt-0">
        {workflow.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WorkflowListItem;
