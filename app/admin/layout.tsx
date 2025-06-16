import React from 'react';
import AdminNavigation from './_components/AdminNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <header className="admin-header mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Section
          </h1>
          <AdminNavigation />
        </header>
        <main className="admin-content">
          {children}
        </main>
        {/* TODO: Implement flash message display here */}
        <p id="alert"></p>
      </div>
    </div>
  );
}
