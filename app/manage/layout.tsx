import React from 'react';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="manage-layout">
      <nav style={{ marginBottom: 16 }}>
        <a href="/manage" className="text-blue-600 dark:text-blue-400 hover:underline">Home</a>
      </nav>
      <main className="manage-content">
        {children}
      </main>
      {/* TODO: Implement flash message display here */}
      <p id="alert"></p>
    </div>
  );
}
