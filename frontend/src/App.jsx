import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import MetricFlowDashboard from './pages/MetricFlowDashboard'
import ATTMapsDeck from './pages/ATTMapsDeck'
import TaskAutomate from './pages/TaskAutomate'
import ShipmentTrack from './pages/ShipmentTrack'
import RentCoDashboard from './pages/RentCoDashboard'
import AcmeCorpDashboard from './pages/AcmeCorpDashboard'
import TrackingDashboard from './pages/TrackingDashboard'
import BentoGridPage from './pages/BentoGridPage'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Trips from './pages/Trips'
import Maintenance from './pages/Maintenance'
import ProtectedRoute from './components/ProtectedRoute'
import WorkspaceLayout from './layouts/WorkspaceLayout'
import CommandPalette from './components/CommandPalette'

export default function App() {
  return (
    <>
      <CommandPalette />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Metric Flow Dashboard: Admin, Fleet Manager, Financial Analyst */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'FINANCIAL_ANALYST']}>
            <WorkspaceLayout>
              <MetricFlowDashboard />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        {/* Live Ops Radar: Admin, Fleet Manager, Safety Officer */}
        <Route path="/live-ops" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER']}>
            <WorkspaceLayout>
              <ATTMapsDeck />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        {/* Task Automation: Admin, Fleet Manager */}
        <Route path="/task-automate" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER']}>
            <WorkspaceLayout>
              <TaskAutomate />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        {/* Shipment Track: Admin, Fleet Manager, Driver */}
        <Route path="/shipment-track" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'DRIVER']}>
            <WorkspaceLayout>
              <ShipmentTrack />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        {/* GPS Tracking: Admin, Fleet Manager, Driver, Safety Officer */}
        <Route path="/tracking" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER']}>
            <WorkspaceLayout>
              <TrackingDashboard />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        {/* Rent Co Leasing: Admin, Fleet Manager, Financial Analyst */}
        <Route path="/rent-co" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'FINANCIAL_ANALYST']}>
            <WorkspaceLayout>
              <RentCoDashboard />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        {/* AcmeCorp Financials: Admin, Fleet Manager, Financial Analyst */}
        <Route path="/acme-corp" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'FINANCIAL_ANALYST']}>
            <WorkspaceLayout>
              <AcmeCorpDashboard />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        {/* Bento Grid Intelligence: Admin, Fleet Manager */}
        <Route path="/bento-grid" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER']}>
            <WorkspaceLayout>
              <BentoGridPage />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />
        
        {/* Vehicles Registry & Health: Admin, Fleet Manager, Safety Officer */}
        <Route path="/vehicles" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER']}>
            <WorkspaceLayout>
              <Vehicles />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />
        
        {/* Drivers Registry & Safety: Admin, Fleet Manager, Safety Officer */}
        <Route path="/drivers" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER']}>
            <WorkspaceLayout>
              <Drivers />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />
        
        {/* Trips Hub: Admin, Fleet Manager, Driver, Financial Analyst */}
        <Route path="/trips" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST']}>
            <WorkspaceLayout>
              <Trips />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />
        
        {/* Maintenance Logs: Admin, Fleet Manager, Safety Officer */}
        <Route path="/maintenance" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER']}>
            <WorkspaceLayout>
              <Maintenance />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}
