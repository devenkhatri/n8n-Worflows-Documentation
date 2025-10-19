import React from 'react';
import { Workflow } from '../types';
import WorkflowCard from './WorkflowCard';

interface WorkflowGridProps {
  workflows: Workflow[];
  onSelectWorkflow: (workflow: Workflow) => void;
}

const WorkflowGrid: React.FC<WorkflowGridProps> = ({ workflows, onSelectWorkflow }) => {
  if (workflows.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 py-20">No workflows found.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} onSelect={onSelectWorkflow} />
      ))}
    </div>
  );
};

export default WorkflowGrid;
