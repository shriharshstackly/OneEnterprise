import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { PageBreadcrumbs } from './PageBreadcrumbs'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f5f9]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#f3f5f9] px-6 pt-4 pb-6">
          <PageBreadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
