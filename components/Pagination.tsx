import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  totalItems
}) => {
  const itemsPerPageOptions = [10, 25, 50, 100];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <label htmlFor="itemsPerPage" className="text-sm text-slate-600 dark:text-slate-400">
          Show
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage === Infinity ? 'all' : itemsPerPage}
          onChange={(e) => {
            const value = e.target.value === 'all' ? Infinity : Number(e.target.value);
            onItemsPerPageChange(value);
            onPageChange(1); // Reset to first page when changing items per page
          }}
          className="text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
        >
          {itemsPerPageOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
          <option value="all">All</option>
        </select>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Showing {Math.min((currentPage - 1) * (itemsPerPage === Infinity ? totalItems : itemsPerPage) + 1, totalItems)}-{Math.min(currentPage * (itemsPerPage === Infinity ? totalItems : itemsPerPage), totalItems)} of {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === page
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;