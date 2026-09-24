# 3D Anatomy Architecture

## Layer Overview

### Data Layer (`src/data/`)
- **schema.ts**: Zod schemas for `BodyPart` (id, nama_id, nama_en, sistem, deskripsi_id) and `Manifest` (array of BodyPart)
- **manifest.json**: JSON array of 15+ body part manifests with Indonesian/English names and system classification
- **loader.ts**: `loadManifest()` - fetches and validates manifest using Zod schema; `getBodyPartById()` and `getPartsBySystem()` helpers
- **transform.ts**: `buildSearchIndex()` - creates a Record<string, BodyPart> index for fast lookup; `searchParts()` - fuzzy search across nama_id, nama_en, sistem, deskripsi_id; `filterBySystem()`
- **index.ts**: Barrel export for all data modules

### Viewer Layer (`src/viewer/`)
- **state/sceneStore.ts**: Zustand store with `selectedId`, `hoverId`, and `visibilityMap` (Record<string, boolean>); actions: setSelected, setHover, toggleVisibility, resetVisibility, reset
- **components/AnatomyScene.tsx**: Minimal `<Canvas>` with `@react-three/fiber`, OrbitControls from `@react-three/drei`, ambient/directional lights, and placeholder mesh boxes until GLB model is loaded
- **components/ModelGroup.tsx**: Placeholder component for future GLB model grouping
- **hooks/usePicking.ts**: Placeholder hook for raycasting/picking interactions

### UI Layer (`src/ui/`)
- **components/Sidebar.tsx**: Lists manifest parts with click handlers that set selectedId in sceneStore
- **components/InfoPanel.tsx**: Displays detail from selected manifest part (nama_id, nama_en, deskripsi_id)
- **components/Toolbar.tsx**: Reset camera and reset selection placeholders
- **hooks/useSearch.ts**: Filter manifest parts by search query using transform.ts utilities
- **pages/ViewerPage.tsx**: Composed page layout: Toolbar + Sidebar + AnatomyScene + InfoPanel in flex layout

### App Layer (`src/app/`)
- **providers.tsx**: Pass-through providers for React context (e.g., React Three Fiber CanvasProvider if needed)
- **App.tsx**: Root application component
- **main.tsx**: Renders `<App />` into `#root` with `<StrictMode>`

### Contracts

#### `loadManifest(path?)`: Promise<Manifest>
- Fetches manifest JSON from `/src/data/manifest.json` (or given path)
- Validates against `ManifestSchema` (Zod)
- Returns parsed Manifest array or throws error
- Exposes helpers: `getBodyPartById(id)`, `getPartsBySystem(system)`

#### `buildSearchIndex(manifest)`: Record<string, BodyPart>
- Creates search index from manifest array
- Enables fast lookup by id, nama_id, or nama_en

#### BodyPart contract:
- `id`: unique string identifier
- `nama_id`: Indonesian name
- `nama_en`: English name
- `sistem`: body system classification (e.g., "Sistem Saraf", "Sistem Pernapasan")
- `deskripsi_id`: short Indonesian description