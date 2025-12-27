import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import Agenda from './pages/Agenda';
import FichasTecnicas from './pages/FichasTecnicas';
import Stock from './pages/Stock';
import PuntoVenta from './pages/PuntoVenta';
import Caja from './pages/Caja';
// 👇 1. Importar los nuevos componentes
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardHome />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="fichas" element={<FichasTecnicas />} />
            <Route path="stock" element={<Stock />} />
            <Route path="ventas" element={<PuntoVenta />} />
            <Route path="caja" element={<Caja />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;