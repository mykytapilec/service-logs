import React from 'react';
import { ServiceLogForm } from './components/ServiceLogForm';
import { LogsTable } from './components/LogsTable';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Service Logs Management</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <ServiceLogForm />
        </div>
        <div>
          <LogsTable />
        </div>
      </div>
    </div>
  );
};
