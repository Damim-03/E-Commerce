import { Outlet } from "react-router"

const DashboardLayout = () => {
  return (
    <div>
      <h1>sidebar</h1>
      
      <div>content</div>

      <div>Dashboard</div>

      <Outlet />
    </div>
  )
}

export default DashboardLayout