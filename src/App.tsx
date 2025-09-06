import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { LogsTable } from './components/LogsTable';
import { Toaster } from 'react-hot-toast';
import { ServiceLogForm } from './components/ServiceLogForm/ServiceLogForm';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Service Logs</h1>
          <ServiceLogForm />
          <LogsTable />
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
