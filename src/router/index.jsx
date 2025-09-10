import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import DashboardIndex from '../pages/dashboard/Index'

// Pages
import { Home } from '../pages/Home'
import { Features } from '../pages/Features'
import { About } from '../pages/About'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Dashboard pages
import { AdminDashboard } from '../pages/dashboard/AdminDashboard'
import { ManagerDashboard } from '../pages/dashboard/ManagerDashboard'
import { DeveloperDashboard } from '../pages/dashboard/DeveloperDashboard'

// Error pages
import { NotFound } from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'features',
        element: <Features />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'auth/login',
        element: <Login />,
      },
      {
        path: 'auth/register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardIndex /> },
    ],
  },
  {
    path: '/admin',
    element: <DashboardLayout userRole="Admin" />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <AdminDashboard />, // Will be replaced with user management
      },
      {
        path: 'system',
        element: <AdminDashboard />, // Will be replaced with system settings
      },
    ],
  },
  {
    path: '/manager',
    element: <DashboardLayout userRole="Manager" />,
    children: [
      {
        index: true,
        element: <ManagerDashboard />,
      },
      {
        path: 'team',
        element: <ManagerDashboard />, // Will be replaced with team overview
      },
    ],
  },
  {
    path: '/developer',
    element: <DashboardLayout userRole="Developer" />,
    children: [
      {
        index: true,
        element: <DeveloperDashboard />,
      },
      {
        path: 'api',
        element: <DeveloperDashboard />, // Will be replaced with API console
      },
      {
        path: 'dev-bots',
        element: <DeveloperDashboard />, // Will be replaced with bot development
      },
      {
        path: 'docs',
        element: <DeveloperDashboard />, // Will be replaced with documentation
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
