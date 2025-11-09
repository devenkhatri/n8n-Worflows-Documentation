import React, { useState, useEffect } from 'react';
import { Workflow } from '../types';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface WorkflowDetailProps {
  workflow: Workflow;
  onBack: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{title}</h2>
    <div className="text-slate-600 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none">
      {children}
    </div>
  </div>
);

// Helper to parse numbered lists from a string
const renderProcessSummary = (summary: string) => {
  const steps = summary.split(/\s*\d+\.\s*/).filter(Boolean);
  if (steps.length > 1) {
    return (
      <ol className="list-decimal list-inside space-y-2">
        {steps.map((step, index) => (
          <li key={index}>{step.trim()}</li>
        ))}
      </ol>
    );
  }
  return <p>{summary}</p>;
};


const WorkflowDetail: React.FC<WorkflowDetailProps> = ({ workflow, onBack }) => {
  const [workflowContent, setWorkflowContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  const isLoading = window.location.pathname.startsWith('/workflow/') && !workflow;

  useEffect(() => {
    if (!workflow?.workflowUrl) return;

    const fetchWorkflowContent = async () => {
      setIsLoadingContent(true);
      setContentError(null);

      try {
        const response = await fetch(workflow.workflowUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const content = await response.text();
        setWorkflowContent(content);
      } catch (error) {
        console.error('Error fetching workflow content:', error);
        setContentError(error instanceof Error ? error.message : 'Failed to fetch workflow content');
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchWorkflowContent();
  }, [workflow?.workflowUrl]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          &larr; Back to Workflows
        </button>
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Workflow Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400">The workflow you're looking for could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        &larr; Back to Workflows
      </button>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{workflow.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{workflow.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {workflow.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        <div>
          {workflowContent && <n8n-demo workflow={workflowContent} frame="true"></n8n-demo>}
        </div>

        <DetailSection title="Input Details">
          <p>{workflow.inputDetails || 'No input details provided.'}</p>
        </DetailSection>

        <DetailSection title="Process Summary">
          {renderProcessSummary(workflow.processSummary || 'No process summary provided.')}
        </DetailSection>

        <DetailSection title="Output Details">
          <p>{workflow.outputDetails || 'No output details provided.'}</p>
        </DetailSection>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <a href={workflow.workflowUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            View Workflow
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </a>
          <a href={workflow.markdownUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            View Markdown
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail;
