import React from 'react';

const Logo: React.FC = () => (
  <div className="flex items-center gap-3">
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path fill="#3b82f6" d="M50 0L85.35 14.65L100 50L85.35 85.35L50 100L14.65 85.35L0 50L14.65 14.65z"/>
      <path fill="white" d="M50 20L72 35V65L50 80L28 65V35z"/>
    </svg>
    <span className="text-xl font-semibold text-slate-800 dark:text-white hidden sm:inline">
      Workflow Explorer
    </span>
  </div>
);

export default Logo;
