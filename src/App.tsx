import React from 'react'
import LogsPage from './pages/LogsPage'

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Service Logs</h1>
      </header>
      <LogsPage />
    </div>
  )
}
