import React, { useMemo } from 'react';
import { ViewMode } from '../types';
import GridIcon from './icons/GridIcon';
import ListIcon from './icons/ListIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import SettingsIcon from './icons/SettingsIcon';
import Logo from './icons/Logo';
import ClockIcon from './icons/ClockIcon';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onShowSettings: () => void;
  lastUpdated: string | null;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  isDarkMode,
  onDarkModeToggle,
  onShowSettings,
  lastUpdated,
}) => {
  const formattedTimestamp = useMemo(() => {
    if (!lastUpdated) return null;
    const date = new Date(lastUpdated);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }, [lastUpdated]);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <Logo />
            {formattedTimestamp && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-4">
                <ClockIcon className="w-4 h-4" />
                <span>Last updated: {formattedTimestamp}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative group">
              <svg aria-hidden="true" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-primary-500" width="20" height="20" fill="none" >
                <path d="m19 19-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
              </svg>
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
                aria-label="Grid View"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
                 aria-label="List View"
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onDarkModeToggle}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
               <button
                onClick={onShowSettings}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;