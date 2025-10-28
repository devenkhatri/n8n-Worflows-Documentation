export const getWorkflowDetailPath = (workflowId: string) => `/workflow/${encodeURIComponent(workflowId)}`;

export const parseWorkflowIdFromPath = () => {
  const path = window.location.pathname;
  const match = path.match(/^\/workflow\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
};