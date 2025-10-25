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

type AppState = 'loading' | 'settings' | 'error' | 'list' | 'detail';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Settings State
  const [sheetId, setSheetId] = useState<string>(() => localStorage.getItem('n8n-sheetId') || '');
  const [sheetName, setSheetName] = useState<string>(() => localStorage.getItem('n8n-sheetName') || 'Sheet1');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('n8n-apiKey') || '');

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => localStorage.getItem('n8n-lastUpdated'));

  const loadWorkflows = useCallback(async (currentSheetId: string, currentSheetName: string, currentApiKey: string) => {
    if (!currentSheetId || !currentApiKey) {
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
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching data.');
      setAppState('error');
    }
  }, []);

  useEffect(() => {
    loadWorkflows(sheetId, sheetName, apiKey);
  }, []);
  
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
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
  }, []);
  
  const handleDarkModeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setAppState('detail');
  };

  const handleBackToList = () => {
    setSelectedWorkflow(null);
    setAppState('list');
  };
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
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
               <button onClick={() => setAppState('settings')} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
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
              <WorkflowGrid workflows={filteredWorkflows} onSelectWorkflow={handleSelectWorkflow} />
            ) : (
              <WorkflowList workflows={filteredWorkflows} onSelectWorkflow={handleSelectWorkflow} />
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
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isDarkMode={isDarkMode}
          onDarkModeToggle={handleDarkModeToggle}
          onRefresh={handleRefresh}
          onShowSettings={() => setAppState('settings')}
          lastUpdated={lastUpdated}
          totalWorkflows={workflows.length}
        />
      )}
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
