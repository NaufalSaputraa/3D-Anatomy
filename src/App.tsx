import { Suspense, lazy } from 'react'

const ViewerPage = lazy(() =>
  import('./ui/pages/ViewerPage').then((m) => ({ default: m.ViewerPage })),
)

function App() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-sm text-gray-500">
          Memuat viewer 3D…
        </div>
      }
    >
      <ViewerPage />
    </Suspense>
  )
}

export default App
