import React, { useState, useEffect } from 'react';

interface SettingsProps {
  initialSheetId: string;
  initialSheetName: string;
  initialApiKey: string;
  onSave: (sheetId: string, sheetName: string, apiKey: string) => void;
  onBack: () => void;
  isInitialSetup: boolean;
  isConfigFromEnv: boolean;
}

const Settings: React.FC<SettingsProps> = ({ initialSheetId, initialSheetName, initialApiKey, onSave, onBack, isInitialSetup, isConfigFromEnv }) => {
  const [sheetId, setSheetId] = useState(initialSheetId);
  const [sheetName, setSheetName] = useState(initialSheetName);
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => {
        setSaveMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const handleSave = () => {
    onSave(sheetId, sheetName, apiKey);
    setSaveMessage('Settings saved successfully!');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
      {!isInitialSetup && (
         <button 
            onClick={onBack}
            className="mb-6 inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
            &larr; Back to Workflows
        </button>
      )}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 sm:p-8 border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Configuration
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isInitialSetup 
                    ? "Welcome! Please configure your Google Sheet to get started." 
                    : "Update your Google Sheet details here."
                }
            </p>
        </div>
        
        {isConfigFromEnv && (
            <div className="bg-primary-50 dark:bg-primary-500/10 p-4 rounded-lg border border-primary-200 dark:border-primary-500/20 mb-6 text-sm text-primary-800 dark:text-primary-200">
                <p>
                Configuration is managed by environment variables and cannot be changed here. The values from environment variables are being used.
                </p>
            </div>
        )}

        <div className="space-y-6">
           <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google API Key"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isConfigFromEnv}
            />
             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Your API key is stored only in your browser's local storage and is not shared.
            </p>
          </div>

          <div>
            <label htmlFor="sheetId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google Sheet ID
            </label>
            <input
              type="text"
              id="sheetId"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="e.g., 1-riOxMmv60xkGW6R1GEzLwtPoXnHdxFQz8VJXpBtN_o"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isConfigFromEnv}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Found in the URL: `.../d/`<strong className="text-primary-500 font-semibold">{`SHEET_ID`}</strong>`/edit...`
            </p>
          </div>
          
          <div>
            <label htmlFor="sheetName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sheet Name
            </label>
            <input
              type="text"
              id="sheetName"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="e.g., Sheet1"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isConfigFromEnv}
            />
             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              The name of the tab in your spreadsheet where the data is located.
            </p>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!sheetId || !sheetName || !apiKey || isConfigFromEnv}
            >
              Save and Fetch Data
            </button>
            {saveMessage && (
                <p className="text-sm text-green-600 dark:text-green-400 animate-fade-in">{saveMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;