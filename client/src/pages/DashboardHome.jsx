import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { abrirWhatsApp } from '../utils/whatsapp';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    turnosHoy: 0,
    ingresosHoy: 0,
    alertasStock: 0,
    proximosTurnos: [],
    listaStockBajo: [],
    clientesRecordar: []
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">

      {/* --- ENCABEZADO: SALUDO Y BOTONES --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-700 tracking-tight">👋 ¡Hola!</h1>
          <p className="text-perru-purple font-bold mt-1 text-lg">
            Resumen de hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/agenda" className="bg-perru-hotpink hover:bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-perru-pink/40 transition-transform active:scale-95 flex items-center gap-2">
            📅 Ver Agenda
          </Link>
          <Link to="/ventas" className="bg-perru-orange hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-transform active:scale-95 flex items-center gap-2">
            🛒 Nueva Venta
          </Link>
        </div>
      </div>

      {/* --- TARJETAS SUPERIORES (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Card 1: Turnos Hoy */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-perru-pink/30 flex items-center justify-between hover:shadow-xl hover:shadow-perru-pink/20 transition-all cursor-default">
          <div>
            <p className="text-perru-purple text-xs font-black uppercase tracking-wider mb-1">Turnos Pendientes</p>
            <h3 className="text-5xl font-black text-gray-700">{stats.turnosHoy}</h3>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-perru-bg text-perru-hotpink flex items-center justify-center text-3xl">
            ✂️
          </div>
        </div>

        {/* Card 2: Caja Hoy */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-perru-pink/30 flex items-center justify-between hover:shadow-xl hover:shadow-perru-pink/20 transition-all cursor-default">
          <div>
            <p className="text-perru-purple text-xs font-black uppercase tracking-wider mb-1">Ingresos Hoy</p>
            <h3 className="text-5xl font-black text-perru-mint drop-shadow-sm">
              ${parseFloat(stats.ingresosHoy).toLocaleString()}
            </h3>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-teal-50 text-teal-500 flex items-center justify-center text-3xl">
            💸
          </div>
        </div>

        {/* Card 3: Alerta Stock */}
        <Link to="/stock" className="bg-white p-6 rounded-3xl shadow-sm border border-perru-pink/30 flex items-center justify-between hover:shadow-xl hover:shadow-perru-pink/20 transition-all group">
          <div>
            <p className="text-perru-purple text-xs font-black uppercase tracking-wider mb-1">Alertas Stock</p>
            <h3 className={`text-5xl font-black ${stats.alertasStock > 0 ? 'text-red-400' : 'text-gray-700'}`}>
              {stats.alertasStock}
              <span className="text-lg text-gray-400 font-bold ml-1">items</span>
            </h3>
          </div>
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl transition-colors ${stats.alertasStock > 0 ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' : 'bg-gray-50 text-gray-300'
            }`}>
            ⚠️
          </div>
        </Link>
      </div>

      {/* --- GRID PRINCIPAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA (Principal) */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. PRÓXIMOS TURNOS */}
          <div className="bg-white rounded-3xl shadow-sm border border-perru-pink/20 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <h2 className="font-black text-gray-700 text-xl flex items-center gap-2">
                📅 Próximos Turnos
              </h2>
              <Link to="/agenda" className="text-perru-hotpink text-sm font-bold hover:underline">Ver Agenda →</Link>
            </div>

            <div className="p-2">
              {stats.proximosTurnos.length === 0 ? (
                <div className="p-10 text-center text-gray-400 font-medium">
                  <span className="text-4xl block mb-2">😴</span>
                  ¡Todo tranquilo! No hay turnos próximos.
                </div>
              ) : (
                stats.proximosTurnos.map((t) => (
                  <div key={t.id} className="group flex items-center p-4 hover:bg-perru-bg rounded-2xl transition-colors mb-1">
                    {/* Hora */}
                    <div className="w-20 text-center border-r-2 border-dashed border-perru-pink/30 pr-4 mr-4">
                      <p className="text-perru-hotpink font-black text-xl">{new Date(t.fecha_turno).getHours()}:{new Date(t.fecha_turno).getMinutes().toString().padStart(2, '0')}</p>
                      <p className="text-gray-400 text-xs font-bold uppercase">{new Date(t.fecha_turno).toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                    </div>

                    {/* Info Perro */}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg">{t.mascota} <span className="text-sm font-medium text-gray-400">({t.raza})</span></h4>
                      <div className="inline-block bg-perru-purple/20 text-perru-purple px-2 py-0.5 rounded-lg text-xs font-bold mt-1">
                        ✂ {t.servicio}
                      </div>
                    </div>

                    {/* Info Dueño */}
                    <div className="hidden sm:block text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Dueño</span>
                        <span className="text-sm font-bold text-gray-600">{t.dueno}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. RECORDATORIOS (WHATSAPP) */}
          <div className="bg-white rounded-3xl shadow-sm border border-perru-pink/20 overflow-hidden">
            <div className="p-6 border-b border-perru-mint/30 bg-perru-mint/10">
              <h2 className="font-black text-teal-700 text-xl flex items-center gap-2">
                🐶 Toca baño/corte
              </h2>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-wide opacity-80">Clientes para recuperar</p>
            </div>

            <div className="p-2">
              {stats.clientesRecordar && stats.clientesRecordar.length === 0 ? (
                <div className="p-8 text-center text-gray-400 font-medium">
                  ✅ ¡Al día! Todos los clientes están en fecha.
                </div>
              ) : (
                stats.clientesRecordar?.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-4 hover:bg-teal-50 rounded-2xl transition-colors mb-1 border border-transparent hover:border-teal-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-gray-700 text-lg">{c.mascota}</p>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg font-bold">Hace {c.dias_pasados} días</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">Ciclo estimado: cada {c.frecuencia_estimada} días</p>
                    </div>

                    <button
                      onClick={() => {
                        const msg = `¡Hola ${c.dueno}! 🐶 Hace mucho no vemos a ${c.mascota}. Ya pasaron ${c.dias_pasados} días de su último corte. ¿Te gustaría reservar un turno para esta semana?`;
                        abrirWhatsApp(c.telefono, msg);
                      }}
                      className="bg-teal-100 text-teal-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95"
                      title="Enviar WhatsApp"
                    >
                      📲
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (Secundaria) */}
        <div className="space-y-8">

          {/* Widget: Stock */}
          <div className="bg-white rounded-3xl shadow-sm border border-perru-pink/20 overflow-hidden">
            <div className="p-6 border-b border-perru-orange/20 bg-perru-orange/10">
              <h2 className="font-black text-orange-700 text-lg flex items-center gap-2">
                🚨 Reponer
              </h2>
            </div>
            <div className="p-4">
              {stats.listaStockBajo.length === 0 ? (
                <div className="text-green-500 font-bold text-sm flex items-center gap-2 bg-green-50 p-3 rounded-xl">
                  ✅ Stock saludable.
                </div>
              ) : (
                <ul className="space-y-2">
                  {stats.listaStockBajo.map((p, i) => (
                    <li key={i} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-700 font-bold truncate w-28">{p.nombre}</span>
                      <span className="bg-white text-red-500 border border-red-100 px-2 py-1 rounded-lg text-xs font-black shadow-sm">
                        {p.stock} u.
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {stats.listaStockBajo.length > 0 && (
                <div className="mt-4 text-center">
                  <Link to="/stock" className="text-perru-orange text-xs font-black uppercase tracking-widest hover:underline">Gestionar Inventario</Link>
                </div>
              )}
            </div>
          </div>

          {/* Widget: Accesos Rápidos */}
          <div className="bg-perru-purple/20 rounded-3xl p-6 border border-perru-purple/30">
            <h3 className="font-black text-perru-purple mb-4 text-lg">Accesos Rápidos</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/fichas" className="bg-white hover:bg-perru-bg p-4 rounded-2xl text-center transition-all shadow-sm hover:shadow-md group">
                <span className="block text-3xl mb-2 group-hover:scale-110 transition-transform">🐶</span>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Nuevo Cliente</span>
              </Link>
              <Link to="/caja" className="bg-white hover:bg-perru-bg p-4 rounded-2xl text-center transition-all shadow-sm hover:shadow-md group">
                <span className="block text-3xl mb-2 group-hover:scale-110 transition-transform">💸</span>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Registrar Gasto</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardHome;