import React, { useState, useMemo } from 'react';
import { Workflow } from '../types';
import WorkflowCard from './WorkflowCard';
import Pagination from './Pagination';

interface WorkflowGridProps {
  workflows: Workflow[];
  onSelectWorkflow: (workflow: Workflow) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

type SortOrder = 'asc' | 'desc';

const WorkflowGrid: React.FC<WorkflowGridProps> = ({
  workflows,
  onSelectWorkflow,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedWorkflows = useMemo(() => {
    const sorted = [...workflows];
    if (sortOrder === 'desc') {
      return sorted.reverse();
    }
    return sorted;
  }, [workflows, sortOrder]);

  if (workflows.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 py-20">No workflows found.</p>;
  }

  const totalPages = itemsPerPage === Infinity ? 1 : Math.ceil(sortedWorkflows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * (itemsPerPage === Infinity ? sortedWorkflows.length : itemsPerPage);
  const visibleWorkflows = itemsPerPage === Infinity
    ? sortedWorkflows
    : sortedWorkflows.slice(startIndex, startIndex + itemsPerPage);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <div className="p-4 pb-2 flex justify-end">
        <button
          onClick={toggleSortOrder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
        >
          <span>Sort</span>
          <svg
            className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4">
        {visibleWorkflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} onSelect={onSelectWorkflow} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        totalItems={sortedWorkflows.length}
      />
    </>
  );
};

export default WorkflowGrid;
