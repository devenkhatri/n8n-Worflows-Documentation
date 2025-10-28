import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Workflow, ViewMode } from './types';
import { fetchWorkflows } from './services/workflowService';
import Header from './components/Header';
import TagFilter from './components/TagFilter';
import WorkflowGrid from './components/WorkflowGrid';
import WorkflowList from './components/WorkflowList';
import WorkflowDetail from './components/WorkflowDetail';
import Settings from './components/Settings';
import Spinner from './components/Spinner';
import { getWorkflowDetailPath, parseWorkflowIdFromPath } from './utils/routing';

type AppState = 'loading' | 'settings' | 'error' | 'list' | 'detail';

// Function to determine initial app state based on URL
const getInitialAppState = (): AppState => {
  const path = window.location.pathname;
  if (path.startsWith('/workflow/')) {
    return 'loading';
  }
  return 'loading';
};

const App: React.FC = () => {
  // Update the environment variable access logic
  const getEnvVar = (key: string) => {
    const viteKey = `VITE_${key}`;
    const nextKey = `NEXT_PUBLIC_${key}`;
    
    // Try import.meta.env first (Vite's way)
    if ((import.meta.env as any)[viteKey]) {
      return (import.meta.env as any)[viteKey];
    }
    
    // Fallback to process.env if available
    if (typeof process !== 'undefined' && process.env && process.env[nextKey]) {
      return process.env[nextKey];
    }
    
    return undefined;
  };

  const envApiKey = getEnvVar('GOOGLE_API_KEY');
  const envSheetId = getEnvVar('GOOGLE_SHEET_ID');
  const envSheetName = getEnvVar('GOOGLE_SHEET_NAME');

  const isConfigFromEnv = !!(envApiKey && envSheetId);

  const [appState, setAppState] = useState<AppState>(getInitialAppState());

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [sheetId, setSheetId] = useState<string>(() => {
    if (isConfigFromEnv && envSheetId) return envSheetId;
    try { return localStorage.getItem('n8n-sheetId') || ''; } catch { return ''; }
  });
  const [sheetName, setSheetName] = useState<string>(() => {
    if (isConfigFromEnv && envSheetName) return envSheetName || 'Sheet1';
    try { return localStorage.getItem('n8n-sheetName') || 'Sheet1'; } catch { return 'Sheet1'; }
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    if (isConfigFromEnv && envApiKey) return envApiKey;
    try { return localStorage.getItem('n8n-apiKey') || ''; } catch { return ''; }
  });

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => localStorage.getItem('n8n-lastUpdated'));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(100);

  const loadWorkflows = useCallback(async (currentSheetId: string, currentSheetName: string, currentApiKey: string) => {
    if (!currentSheetId || !currentApiKey) {
      // If we don't have required config, show settings so the user can enter it.
      setError('Missing configuration: please provide your Google Sheet ID and API Key.');
      setAppState('settings');
      return;
    }
    setAppState('loading');
    try {
      setError(null);
      const data = await fetchWorkflows(currentSheetId, currentSheetName, currentApiKey);
      setWorkflows(data);
      const timestamp = new Date().toISOString();
      localStorage.setItem('n8n-lastUpdated', timestamp);
      setLastUpdated(timestamp);
      setAppState('list');
    } catch (err) {
      // When fetching fails (network, API, parsing), expose the error but show Settings
      // so the user can correct configuration and retry.
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching data.');
      setAppState('settings');
    }
  }, [isConfigFromEnv]);

  // Combined data loading and routing effect
  useEffect(() => {
    const initializeApp = async () => {
      const workflowId = parseWorkflowIdFromPath();
      
      try {
        const loadedWorkflows = await fetchWorkflows(sheetId, sheetName, apiKey);
        setWorkflows(loadedWorkflows);
        
        if (workflowId) {
          const workflow = loadedWorkflows.find(w => w.id === workflowId);
          if (workflow) {
            setSelectedWorkflow(workflow);
            setAppState('detail');
          } else {
            // If workflow not found, show error state
            setAppState('list');
          }
        } else {
          setAppState('list');
        }
        
        const timestamp = new Date().toISOString();
        localStorage.setItem('n8n-lastUpdated', timestamp);
        setLastUpdated(timestamp);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching data.');
        setAppState('settings');
      }
    };

    initializeApp();
  }, [sheetId, sheetName, apiKey]);
  
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSaveSettings = (newSheetId: string, newSheetName: string, newApiKey: string) => {
    // Allow saving even when env variables exist so users can override/repair config.
    localStorage.setItem('n8n-sheetId', newSheetId);
    localStorage.setItem('n8n-sheetName', newSheetName);
    localStorage.setItem('n8n-apiKey', newApiKey);
    setSheetId(newSheetId);
    setSheetName(newSheetName);
    setApiKey(newApiKey);
    loadWorkflows(newSheetId, newSheetName, newApiKey);
  };

  const handleRefresh = useCallback(() => {
    loadWorkflows(sheetId, sheetName, apiKey);
  }, [sheetId, sheetName, apiKey, loadWorkflows]);

  const topTagsWithCounts = useMemo(() => {
    const tagCounts: { [key: string]: number } = {};
    workflows.forEach(workflow => {
      workflow.tags.forEach(tag => {
        if (tag) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [workflows]);

  const filteredWorkflows = useMemo(() => {
    return workflows
      .filter(workflow =>
        workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(workflow =>
        selectedTags.length === 0 ||
        selectedTags.every(tag => workflow.tags.includes(tag))
      );
  }, [workflows, searchTerm, selectedTags]);

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setCurrentPage(1); // Reset to first page when clearing filters
  }, []);
  
  const handleDarkModeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setAppState('detail');
    // Update URL without refreshing the page
    window.history.pushState({}, '', getWorkflowDetailPath(workflow.id));
  };

  const handleBackToList = () => {
    setSelectedWorkflow(null);
    setAppState('list');
    // Update URL to home page without refreshing
    window.history.pushState({}, '', '/');
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const workflowId = parseWorkflowIdFromPath();
      if (workflowId) {
        const workflow = workflows.find(w => w.id === workflowId);
        if (workflow) {
          setSelectedWorkflow(workflow);
          setAppState('detail');
        } else {
          // If workflow not found, redirect to home
          window.history.pushState({}, '', '/');
          setSelectedWorkflow(null);
          setAppState('list');
        }
      } else {
        setSelectedWorkflow(null);
        setAppState('list');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [workflows]);
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
        const isDetailView = window.location.pathname.startsWith('/workflow/');
        if (isDetailView) {
          return (
            <div className="p-4 sm:p-6 md:p-8">
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
        return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><Spinner /></div>;
      
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-4rem)]">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 shadow-sm rounded-lg p-8 border border-red-500/20 dark:border-red-500/30">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-red-500 mr-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Application Error</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Could not load your workflow data. Please check the error message and your configuration settings.
              </p>
              <pre className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-md text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap font-mono break-words">
                {error}
              </pre>
               <button onClick={() => setAppState('settings')} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50" disabled={isConfigFromEnv}>
                Go to Settings
              </button>
            </div>
          </div>
        );
      
      case 'settings':
         return (
              <Settings 
                initialSheetId={sheetId}
                initialSheetName={sheetName}
                initialApiKey={apiKey}
                onSave={handleSaveSettings}
                onBack={handleBackToList}
                isInitialSetup={!workflows.length}
                isConfigFromEnv={isConfigFromEnv}
                error={error} // Pass the error message to Settings
              />
          );

      case 'detail':
        return selectedWorkflow && (
            <WorkflowDetail workflow={selectedWorkflow} onBack={handleBackToList} />
        );

      case 'list':
        return (
          <>
            <TagFilter 
              tags={topTagsWithCounts} 
              selectedTags={selectedTags} 
              onTagSelect={handleTagSelect}
              onClearFilters={clearFilters}
            />
            {viewMode === 'grid' ? (
              <WorkflowGrid 
                workflows={filteredWorkflows} 
                onSelectWorkflow={handleSelectWorkflow}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            ) : (
              <WorkflowList 
                workflows={filteredWorkflows} 
                onSelectWorkflow={handleSelectWorkflow}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </>
        );
      default:
        return null;
    }
  }

  const showHeader = appState !== 'loading';

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {showHeader && (
        <Header
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isDarkMode={isDarkMode}
          onDarkModeToggle={handleDarkModeToggle}
          onRefresh={handleRefresh}
          onShowSettings={() => setAppState('settings')}
          lastUpdated={lastUpdated}
          totalWorkflows={workflows.length}
          showSettingsButton={!isConfigFromEnv}
        />
      )}
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;