import React from 'react';
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

const WorkflowGrid: React.FC<WorkflowGridProps> = ({ 
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
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
        totalItems={workflows.length}
      />
    </>
  );
};

export default WorkflowGrid;
