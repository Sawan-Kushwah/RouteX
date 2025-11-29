
import './App.css'
import { lazy, Suspense } from 'react';
import Home from './components/Home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'
import SelectBusSkeleton from './components/SelectBusSkeleton.jsx';
import AdminDashboardSkeleton from './adminDashboard/AdminDashboardSkeleton.jsx';

const SelectBus = lazy(() => import('./components/SelectBus.jsx'));
const AdminDashboard = lazy(() => import('./adminDashboard/AdminDashboard.jsx'));

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/location" element={
            <ProtectedRoute role="driver">
              <Suspense fallback={<SelectBusSkeleton />}>
                <SelectBus />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Suspense fallback={<AdminDashboardSkeleton />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
