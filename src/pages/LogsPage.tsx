import React from 'react'
import ServiceLogForm from '../components/ServiceLogForm'
import LogsTable from '../components/LogsTable'

export default function LogsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <ServiceLogForm />
      </div>
      <div className="md:col-span-2">
        <LogsTable />
      </div>
    </div>
  )
}
