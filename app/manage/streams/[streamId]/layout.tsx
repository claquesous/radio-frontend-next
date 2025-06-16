import React from 'react';
import StreamNavigation from './_components/StreamNavigation';

export default function StreamManageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { streamId: string };
}) {
  return (
    <div className="stream-manage-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <header className="stream-header mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Manage Stream
          </h1>
          <StreamNavigation streamId={params.streamId} />
        </header>
        <main className="stream-content">
          {children}
        </main>
        <p id="alert"></p>
      </div>
    </div>
  );
}
