import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
// import { ServiceLogForm } from './components/ServiceLogForm';
import { LogsTable } from './components/LogsTable';
import './index.css';
import { ServiceLogForm } from './components/ServiceLogForm/ServiceLogForm';

const App = () => (
  <div className="container mx-auto p-4">
    <ServiceLogForm />
    <LogsTable />
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
