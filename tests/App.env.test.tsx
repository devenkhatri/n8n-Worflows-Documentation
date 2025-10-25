import React from 'react';
import { render, waitFor } from '@testing-library/react';
import * as svc from '../services/workflowService';
import { vi } from 'vitest';

describe('App environment behavior', () => {
  beforeEach(() => {
    // clear localStorage keys that might interfere
    try { localStorage.clear(); } catch {}
    // reset module registry so App picks up new env each test
    vi.resetModules();
  });

  it('auto-loads workflows when env vars are present', async () => {
    // Provide env vars via process.env fallback used by getEnvVar in App.tsx
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID = 'sheet-123';
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_NAME = 'Sheet1';

    // Replace the real fetchWorkflows with a mock
    const fetchMock = vi.fn().mockResolvedValue([]);
    (svc as any).fetchWorkflows = fetchMock;

    // Dynamically import App so it picks up the env vars and the mocked service
    const { default: App } = await import('../App');

    render(<App />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('sheet-123', 'Sheet1', 'test-key');
    });
  });
});
