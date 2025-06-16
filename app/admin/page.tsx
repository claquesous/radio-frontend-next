import React from 'react';

export default function AdminPage() {
  return (
    <div className="admin-dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Admin
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Use the navigation above to manage your radio station.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Quick Stats
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Statistics and metrics will be displayed here.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Recent Activity
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Recent admin activities will be shown here.
          </p>
        </div>
      </div>
    </div>
  );
}
