import { useState, useEffect } from 'react';
import ModalTurno from '../components/ModalTurno';
import ModalCobro from '../components/ModalCobro';
import { abrirWhatsApp } from '../utils/whatsapp';

const Agenda = () => {
  const [turnos, setTurnos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaInicioSemana, setFechaInicioSemana] = useState(new Date());
  const [modalCobroAbierto, setModalCobroAbierto] = useState(false);
  const [turnoParaCobrar, setTurnoParaCobrar] = useState(null);

  const cargarTurnos = () => {
    fetch('/api/turnos')
      .then(res => res.json())
      .then(data => setTurnos(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  // Función para cambiar estado (Backend) - INTACTA
  const cambiarEstadoTurno = async (id, nuevoEstado) => {
    if (!window.confirm(`¿Marcar este turno como ${nuevoEstado}?`)) return;

    try {
      const res = await fetch(`/api/turnos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (res.ok) {
        cargarTurnos(); // Recargamos para ver el cambio
      }
    } catch (error) {
      console.error(error);
      alert('Error al actualizar');
    }
  };

  // --- CALENDARIO (LÓGICA INTACTA) ---
  const obtenerLunes = (d) => {
    const dia = new Date(d);
    const day = dia.getDay();
    const diff = dia.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(dia.setDate(diff));
  };

  const cambiarSemana = (dias) => {
    const nuevaFecha = new Date(fechaInicioSemana);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaInicioSemana(nuevaFecha);
  };

  // Generamos 7 DÍAS (Lunes a Domingo)
  const diasSemana = [];
  const lunesActual = obtenerLunes(fechaInicioSemana);

  for (let i = 0; i < 7; i++) {
    const fechaDia = new Date(lunesActual);
    fechaDia.setDate(lunesActual.getDate() + i);
    diasSemana.push(fechaDia);
  }

  // ... dentro de Agenda.jsx

  const obtenerTurnosDelDia = (fecha) => {
    return turnos.filter(t => {
      // 1. Tomamos los primeros 10 caracteres (YYYY-MM-DD) sin importar si hay T o espacio
      const fechaTurnoStr = t.fecha_turno.substring(0, 10);

      // 2. Convertimos la fecha de la columna a YYYY-MM-DD local (para evitar líos de zona horaria)
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      const fechaDiaStr = `${año}-${mes}-${dia}`;

      return fechaTurnoStr === fechaDiaStr;
    });
  };

  const iniciarCobro = (turno) => {
    setTurnoParaCobrar(turno);
    setModalCobroAbierto(true);
  };

  const cancelarTurno = async (id) => {
    if (!window.confirm('¿Seguro deseas cancelar este turno?')) return;
    try {
      await fetch(`/api/turnos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Cancelado' })
      });
      cargarTurnos();
    } catch (error) { console.error(error); }
  };

  const tituloMes = lunesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Colores según estado para el borde de la tarjeta (ADAPTADO A PALETA PERRU)
  const getBordeEstado = (estado) => {
    if (estado === 'Finalizado') return 'border-l-4 border-l-green-400 opacity-60 bg-gray-50';
    if (estado === 'Cancelado') return 'border-l-4 border-l-red-400 opacity-60 bg-red-50/30';
    return 'border-l-4 border-l-perru-hotpink bg-white shadow-sm'; // Pendiente (color principal)
  };

  return (
    <div className="flex flex-col h-full min-h-screen pb-20 md:pb-0 p-4 md:p-8">

      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

        {/* Navegación Fechas */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-perru-pink/20 w-full md:w-auto justify-between md:justify-start">
          <button onClick={() => cambiarSemana(-7)} className="w-10 h-10 flex items-center justify-center hover:bg-perru-pink/10 rounded-full text-perru-purple font-bold text-xl">‹</button>

          <div className="text-center">
            <h2 className="text-lg md:text-2xl font-black text-gray-700 capitalize">{tituloMes}</h2>
            <button onClick={() => setFechaInicioSemana(new Date())} className="text-xs font-bold text-perru-hotpink uppercase tracking-wide">Volver a Hoy</button>
          </div>

          <button onClick={() => cambiarSemana(7)} className="w-10 h-10 flex items-center justify-center hover:bg-perru-pink/10 rounded-full text-perru-purple font-bold text-xl">›</button>
        </div>

        {/* Botón Nuevo Turno (Flotante en móvil o fijo en Desktop) */}
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-perru-hotpink hover:bg-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-perru-pink/40 flex items-center gap-2 font-bold transition-transform active:scale-95 w-full md:w-auto justify-center"
        >
          <span>+</span> Nuevo Turno
        </button>
      </div>

      <ModalTurno isOpen={modalAbierto} onClose={() => setModalAbierto(false)} alGuardar={cargarTurnos} />
      <ModalCobro
        isOpen={modalCobroAbierto}
        onClose={() => setModalCobroAbierto(false)}
        turno={turnoParaCobrar}
        alConfirmar={cargarTurnos}
      />

      {/* GRILLA RESPONSIVE (La magia ocurre aquí) */}
      {/* Mobile: grid-cols-1 (Lista) | Desktop: grid-cols-7 (Calendario) */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-2">
        {diasSemana.map((dia, index) => {
          const esHoy = new Date().toDateString() === dia.toDateString();
          const turnosDia = obtenerTurnosDelDia(dia);

          return (
            <div key={index} className="flex flex-col min-h-[150px] md:min-h-[400px]">

              {/* CABECERA DEL DÍA */}
              <div className={`p-3 rounded-t-2xl md:rounded-t-3xl flex md:block justify-between items-center ${esHoy ? 'bg-perru-hotpink text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
                }`}>

                {/* En móvil: "LUNES 27" en una línea */}
                <div className="flex items-baseline gap-2 md:block md:text-center">
                  <span className={`text-xs md:text-[10px] font-black uppercase tracking-widest ${esHoy ? 'text-white/80' : 'text-gray-400'}`}>
                    {dia.toLocaleDateString('es-ES', { weekday: 'long' })}
                  </span>
                  <span className={`text-xl md:text-2xl font-black ${esHoy ? 'text-white' : 'text-gray-600'}`}>
                    {dia.getDate()}
                  </span>
                </div>

                {/* Contador de turnos (solo visible en móvil para ahorrar espacio) */}
                <span className="md:hidden text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                  {turnosDia.length} citas
                </span>
              </div>

              {/* LISTA DE TURNOS */}
              <div className="bg-gray-50 md:bg-white/60 rounded-b-2xl md:rounded-b-3xl flex-1 p-2 space-y-3 border border-t-0 border-perru-pink/10">
                {turnosDia.length === 0 && (
                  <div className="text-center py-4 text-gray-300 text-xs font-medium italic">Sin turnos</div>
                )}
                {turnosDia.map(turno => (
                  <div key={turno.id} className={`p-3 rounded-2xl relative group ${getBordeEstado(turno.estado)}`}>

                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-gray-700 text-xs bg-gray-100 px-2 py-0.5 rounded-lg">
                        {turno.fecha_turno.split('T')[1].substring(0, 5)} hs
                      </span>
                      <button
                        onClick={() => {
                          const fechaStr = new Date(turno.fecha_turno).toLocaleDateString();
                          const horaStr = new Date(turno.fecha_turno).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const msg = `¡Hola ${turno.nombre_dueno}! 🐾 Te recordamos el turno de ${turno.nombre_mascota} para el ${fechaStr} a las ${horaStr}. ¡Los esperamos!`;
                          abrirWhatsApp(turno.telefono_dueno, msg);
                        }}
                        className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center"
                      >📱</button>
                    </div>

                    <h4 className={`font-black text-sm mt-1 ${turno.estado !== 'Pendiente' ? 'text-gray-400 line-through decoration-2' : 'text-gray-800'}`}>
                      {turno.nombre_mascota}
                    </h4>
                    <p className="text-xs text-perru-purple truncate font-bold">✂ {turno.servicio || 'Varios'}</p>
                    <p className="text-[10px] text-gray-400 truncate uppercase tracking-wide">{turno.nombre_dueno}</p>

                    {/* Botones Acciones (Siempre visibles en móvil, hover en desktop) */}
                    {turno.estado === 'Pendiente' && (
                      <div className="flex gap-2 mt-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity justify-end">
                        <button onClick={() => cancelarTurno(turno.id)} className="text-xs text-red-400 font-bold border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50">Cancelar</button>
                        <button onClick={() => iniciarCobro(turno)} className="text-xs bg-green-500 text-white font-bold px-3 py-1 rounded-lg shadow-sm hover:bg-green-600">Cobrar</button>
                      </div>
                    )}

                    {turno.estado !== 'Pendiente' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg mt-2 inline-block font-bold uppercase tracking-wider ${turno.estado === 'Finalizado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {turno.estado}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Agenda;