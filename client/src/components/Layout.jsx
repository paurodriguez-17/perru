import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/agenda', label: 'Agenda', icon: '📅' },
    { path: '/fichas', label: 'Clientes', icon: '🐶' },
    { path: '/stock', label: 'Inventario', icon: '🦴' },
    { path: '/ventas', label: 'Punto de Venta', icon: '🛒' },
    { path: '/caja', label: 'Caja', icon: '💸' },
  ];

  return (
    <div className="flex h-screen bg-perru-bg overflow-hidden font-sans">

      {/* --- SIDEBAR (Menú Lateral) --- */}
      {/* Overlay para cerrar menú en celular */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* El Menú en sí */}
      <aside className={`
                fixed md:static inset-y-0 left-0 z-30
                w-64 bg-white shadow-2xl md:shadow-none border-r border-perru-pink/30
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col
            `}>
        {/* LOGO */}
        <div className="p-6 flex flex-col items-center justify-center border-b border-dashed border-perru-pink/50">
          <img
            src="/logo.png"
            alt="Perruqueria Logo"
            className="w-32 h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform"
            onError={(e) => { e.target.style.display = 'none' }} // Si no carga, no se rompe
          />
          {/* Texto de respaldo por si no cargas la imagen aun */}
          <h1 className="text-2xl font-black text-perru-hotpink mt-2 tracking-wide font-sans">PERRU<span className="text-perru-mint">QUERIA</span></h1>
        </div>

        {/* LINKS */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)} // Cerrar al clickear en movil
                className={`
                                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200
                                    font-bold text-sm tracking-wide
                                    ${isActive
                    ? 'bg-perru-hotpink text-white shadow-lg shadow-perru-hotpink/30 translate-x-1'
                    : 'text-gray-500 hover:bg-perru-bg hover:text-perru-hotpink'
                  }
                                `}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer del menú */}
        <div className="p-4 text-center">
          <p className="text-xs text-perru-purple font-bold">🐶 Spa & Shop</p>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-perru-bg">
        {/* Barra Superior Móvil */}
        <header className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between border-b border-perru-pink/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <h1 className="font-bold text-gray-600">Perruquería</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-perru-bg text-perru-hotpink"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </header>

        {/* Área de trabajo (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;