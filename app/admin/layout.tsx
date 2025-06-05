import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h2>Admin Section</h2>
        {/* Navigation specific to admin section can go here */}
      </header>
      <main className="admin-content">
        {children}
      </main>
      {/* TODO: Implement flash message display here */}
      <p id="alert"></p>
    </div>
  );
}
