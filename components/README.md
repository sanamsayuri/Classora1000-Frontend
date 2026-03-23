# Shared Components

This directory is for shared/reusable UI components used across the frontend application.

## Usage

Import components from this directory into your Next.js pages:

```tsx
import { ComponentName } from '@/components/ComponentName';
```

## Planned Components

Components to be extracted and shared across the application:

- **Sidebar** — Dashboard navigation sidebar
- **DataTable** — Reusable data table with sorting/filtering
- **Modal** — Reusable modal dialog
- **Card** — Dashboard stat cards
- **LoadingSpinner** — Loading state indicator
- **ErrorAlert** — Error message display
- **Pagination** — Table pagination controls
- **SearchBar** — Search and filter input
- **Badge** — Status badge component
- **Avatar** — User avatar component

## Adding Components

1. Create a new `.tsx` file in this directory
2. Export the component as default or named export
3. Import it in your pages using the `@/components` alias
