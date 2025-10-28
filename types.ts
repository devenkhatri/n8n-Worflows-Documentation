
export interface Workflow {
  id: string;
  title: string;
  description: string;
  inputDetails: string;
  processSummary: string;
  outputDetails: string;
  workflowUrl: string;
  markdownUrl: string;
  workflowJson: string;
  tags: string[];
}

export type ViewMode = 'grid' | 'list';
