# Service Logs Manager

## Overview

Service Logs Manager is a web application designed to manage service logs for vehicles. The app allows users to create, edit, delete, and track service logs efficiently. It supports saving drafts, automatic data persistence, and provides search, filtering, and sorting functionalities.

---

## Features

- **Create Service Logs**
  - Users can fill in service logs with fields like Provider ID, Service Order, Car ID, Odometer, Engine Hours, Start/End Dates, Service Type, and Description.
  - Drafts can be automatically saved while filling out the form.
  - Fields are automatically saved to Redux + LocalStorage to ensure data persists after page reloads.
  - Form validation ensures required fields are filled and values are valid.

- **Edit Service Logs**
  - Edit existing logs using a modal dialog.
  - Updated logs automatically update the Redux store and persist in LocalStorage.
  - Notifications inform the user when logs are successfully updated.

- **Delete Service Logs**
  - Remove existing logs from the list.
  - Deleted logs are removed from both Redux state and LocalStorage.
  - Confirmation and notifications help prevent accidental deletions.

- **View Logs**
  - Display service logs in a table.
  - Search and filter by key fields (Provider ID, Car ID, Service Type, Date Range).
  - Sortable columns with visual indicators.
  - Pagination-ready layout (optional for large datasets).

- **Draft Management**
  - Save drafts for later editing.
  - Auto-save status indicator (`Saving...` / `Draft saved`).
  - Delete single or all drafts.
  
---

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS, Radix UI  
- **State Management:** Redux Toolkit with Redux Persist (LocalStorage)  
- **Utilities:** Lodash (for debounce), UUID (for unique IDs)  
- **Notifications:** Custom hook-based toast notifications  
- **Form Management:** Auto-save hooks for drafts and local state  
- **Accessibility:** Radix Dialogs with proper ARIA attributes  

---

## Project Structure

src/
├─ components/
│ ├─ ServiceLogForm.tsx
│ ├─ LogsTable.tsx
│ └─ EditLogModal.tsx
├─ redux/
│ ├─ slices/
│ │ ├─ draftsSlice.ts
│ │ └─ logsSlice.ts
│ └─ store.ts
├─ hooks/
│ ├─ useAutoSaveDraft.ts
│ └─ useToast.ts
├─ types/
│ └─ index.ts
├─ main.tsx
└─ App.tsx

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mykytapilec/service-logs.git
cd service-logs

2. Install dependencies:

npm install
# or
yarn install

3. Start the development server:

npm run dev
# or
yarn dev

4. Open your browser and go to:

http://localhost:5173

---

## Usage

1. Creating a Service Log

- Fill out the form fields.
- Drafts are saved automatically.
- Click "Create Service Log" to save permanently.

2. Editing a Service Log

- Click the "Edit" button on a log.
- Modify the fields in the modal and save.
- Notifications will confirm the update.

3. Deleting a Service Log

- Click the "Delete" button on a log.
- Confirm deletion.
- Log is removed and notification is shown.

4. Searching and Filtering

- Use the search input and filter controls above the logs table to find specific logs.
- Sort columns by clicking the column headers.

5. Managing Drafts

- Auto-saved drafts appear in the drafts list.
- Delete individual drafts or clear all drafts.

---

## Notes

- All data is persisted using Redux Persist (LocalStorage).
- Validation ensures that all required fields are filled and dates are consistent.
- The app uses Radix UI components for accessibility and consistent UI design.

---

## License

- This project is licensed under the MIT License.