import React from 'react';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="manage-layout">
      <header className="manage-header">
        <h2>Manage Section</h2>
        {/* Navigation specific to manage section can go here */}
      </header>
      <main className="manage-content">
        {children}
      </main>
      {/* TODO: Implement flash message display here */}
      <p id="alert"></p>
    </div>
  );
}
