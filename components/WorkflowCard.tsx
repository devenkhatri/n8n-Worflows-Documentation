import React from 'react';
import { Workflow } from '../types';

interface WorkflowCardProps {
  workflow: Workflow;
  onSelect: (workflow: Workflow) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(workflow)}
      className="bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-full"
    >
      <div className="p-6 flex-grow">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{workflow.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3">
          {workflow.description}
        </p>
      </div>
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="flex flex-wrap gap-2">
          {workflow.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard;
