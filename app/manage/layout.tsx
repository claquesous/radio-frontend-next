import React from 'react';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="manage-layout bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <nav style={{ marginBottom: 16 }}>
        <a
          href="/manage"
          className="inline-flex items-center px-3 py-2 rounded bg-blue-600 text-white dark:bg-blue-400 dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
          aria-label="Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
          </svg>
          Home
        </a>
      </nav>
      <main className="manage-content">
        {children}
      </main>
      {/* TODO: Implement flash message display here */}
      <p id="alert"></p>
    </div>
  );
}
