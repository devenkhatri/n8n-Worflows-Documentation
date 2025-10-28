import React from 'react';
import { Workflow } from '../types';
import WorkflowListItem from './WorkflowListItem';
import Pagination from './Pagination';

interface WorkflowListProps {
  workflows: Workflow[];
  onSelectWorkflow: (workflow: Workflow) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({ 
  workflows,
  onSelectWorkflow,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
    if (workflows.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-20">No workflows found.</p>;
    }

    const totalPages = itemsPerPage === Infinity ? 1 : Math.ceil(workflows.length / itemsPerPage);
    const startIndex = (currentPage - 1) * (itemsPerPage === Infinity ? workflows.length : itemsPerPage);
    const visibleWorkflows = itemsPerPage === Infinity
      ? workflows
      : workflows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Workflow Title</h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {visibleWorkflows.map((workflow) => (
                <WorkflowListItem key={workflow.id} workflow={workflow} onSelect={onSelectWorkflow} />
            ))}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        totalItems={workflows.length}
      />
    </div>
  );
};

export default WorkflowList;
