import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.css'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ReportsPage } from './pages/ReportsPage'
import { ReportDetailPage } from './pages/ReportDetailPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { NewReportPage } from './pages/NewReportPage'
import { AdminPage } from './pages/AdminPage'
import { RequireAdmin } from './components/RequireAdmin'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 30, retry: 1, refetchOnWindowFocus: false } },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'reports/new', element: <NewReportPage /> },
      { path: 'reports/:id', element: <ReportDetailPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'login', element: <LoginPage /> },
      { element: <RequireAdmin />, children: [{ path: 'admin', element: <AdminPage /> }] },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
