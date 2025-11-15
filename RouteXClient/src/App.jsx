
import './App.css'
import Home from './components/Home.jsx'
import MapComponent from './components/MapComponent.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectBus from './components/selectBus.jsx';
import AdminDashboard from './adminDashboard/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/location" element={
            <ProtectedRoute role="driver">
              <SelectBus />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
