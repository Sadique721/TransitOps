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
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MetricFlowDashboard />
          </ProtectedRoute>
        } />

        <Route path="/live-ops" element={
          <ProtectedRoute>
            <ATTMapsDeck />
          </ProtectedRoute>
        } />

        <Route path="/task-automate" element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <TaskAutomate />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />

        <Route path="/shipment-track" element={
          <ProtectedRoute>
            <ShipmentTrack />
          </ProtectedRoute>
        } />

        <Route path="/tracking" element={
          <ProtectedRoute>
            <TrackingDashboard />
          </ProtectedRoute>
        } />

        <Route path="/rent-co" element={
          <ProtectedRoute>
            <RentCoDashboard />
          </ProtectedRoute>
        } />

        <Route path="/acme-corp" element={
          <ProtectedRoute>
            <AcmeCorpDashboard />
          </ProtectedRoute>
        } />

        <Route path="/bento-grid" element={
          <ProtectedRoute>
            <BentoGridPage />
          </ProtectedRoute>
        } />
        
        <Route path="/vehicles" element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <Vehicles />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/drivers" element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <Drivers />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/trips" element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <Trips />
            </WorkspaceLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/maintenance" element={
          <ProtectedRoute>
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
