import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardHome from './pages/DashboardHome'
import Agenda from './pages/Agenda'
import Caja from './pages/Caja'
import FichasTecnicas from './pages/FichasTecnicas'
import Stock from './pages/Stock';
import PuntoVenta from './pages/PuntoVenta';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="caja" element={<Caja />} />
          <Route path="fichas" element={<FichasTecnicas />} />
          <Route path="stock" element={<Stock />} />
          <Route path="ventas" element={<PuntoVenta />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App