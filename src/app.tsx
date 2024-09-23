import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import HMI from './pages/alp_controller_hmi'
import AlpController from './pages/alp_controller'
import Home from './pages/home'
import PrivateRoute from './components/auth/PrivateRoute'

export default function App() {
  return (
    <Routes>
      {/* Define the routes */}
      <Route path="/" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/alp_controller/HMI" element={<HMI />} />
        <Route path="/alp_controller" element={<AlpController />} />
      </Route>
    </Routes>
  )
}