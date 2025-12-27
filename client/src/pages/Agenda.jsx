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

  const obtenerTurnosDelDia = (fecha) => {
    return turnos.filter(t => {
      const fechaTurno = new Date(t.fecha_turno);
      return fechaTurno.getDate() === fecha.getDate() &&
        fechaTurno.getMonth() === fecha.getMonth() &&
        fechaTurno.getFullYear() === fecha.getFullYear();
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

  const tituloMes = lunesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }); // Quitamos upperCase forzado para usar CSS capitalize

  // Colores según estado para el borde de la tarjeta (ADAPTADO A PALETA PERRU)
  const getBordeEstado = (estado) => {
    if (estado === 'Finalizado') return 'border-l-4 border-l-green-400 opacity-60 bg-gray-50';
    if (estado === 'Cancelado') return 'border-l-4 border-l-red-400 opacity-60 bg-red-50/30';
    return 'border-l-4 border-l-perru-hotpink bg-white shadow-sm'; // Pendiente (color principal)
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-perru-pink/20">
          <h2 className="text-2xl font-black text-gray-700 capitalize px-2">📅 {tituloMes}</h2>
          <div className="flex bg-perru-bg rounded-xl border border-perru-pink/20 overflow-hidden">
            <button onClick={() => cambiarSemana(-7)} className="px-4 py-2 hover:bg-perru-pink/20 text-perru-purple font-bold">‹</button>
            <button onClick={() => setFechaInicioSemana(new Date())} className="px-4 py-2 hover:bg-perru-pink/20 text-xs font-black text-perru-hotpink border-l border-r border-perru-pink/20 uppercase tracking-wide">Hoy</button>
            <button onClick={() => cambiarSemana(7)} className="px-4 py-2 hover:bg-perru-pink/20 text-perru-purple font-bold">›</button>
          </div>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="bg-perru-hotpink hover:bg-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-perru-pink/40 flex items-center gap-2 font-bold transition-transform active:scale-95"
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

      {/* GRILLA DE 7 COLUMNAS (Estilo Perruquería) */}
      <div className="flex-1 grid grid-cols-7 gap-4 overflow-x-auto pb-4 min-w-[1000px]">
        {diasSemana.map((dia, index) => {
          const esHoy = new Date().toDateString() === dia.toDateString();
          const turnosDia = obtenerTurnosDelDia(dia);

          return (
            <div key={index} className="flex flex-col h-full min-w-[140px]">

              {/* CABECERA DEL DÍA */}
              <div className={`text-center p-3 rounded-t-3xl mb-2 transition-colors ${esHoy
                  ? 'bg-perru-hotpink text-white shadow-md shadow-perru-pink/30'
                  : 'bg-white text-gray-400 border border-transparent'
                }`}>
                <p className={`text-[10px] font-black uppercase tracking-widest ${esHoy ? 'text-white/80' : 'text-gray-400'}`}>
                  {dia.toLocaleDateString('es-ES', { weekday: 'short' })}
                </p>
                <p className={`text-2xl font-black ${esHoy ? 'text-white' : 'text-gray-600'}`}>
                  {dia.getDate()}
                </p>
              </div>

              {/* COLUMNA DE TURNOS */}
              <div className="bg-white/60 rounded-b-3xl flex-1 p-2 space-y-3 min-h-[400px] border border-perru-pink/10">
                {turnosDia.map(turno => (
                  <div key={turno.id} className={`p-3 rounded-2xl transition-all group relative overflow-hidden ${getBordeEstado(turno.estado)}`}>

                    <div className="flex justify-between items-start mb-1 relative z-10">
                      <span className="font-black text-gray-700 text-xs bg-white/50 px-2 py-0.5 rounded-lg">
                        {new Date(turno.fecha_turno).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <div className="flex gap-1">
                        {/* BOTÓN WHATSAPP */}
                        <button
                          onClick={() => {
                            const fechaStr = new Date(turno.fecha_turno).toLocaleDateString();
                            const horaStr = new Date(turno.fecha_turno).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const msg = `¡Hola ${turno.nombre_dueno}! 🐾 Te recordamos el turno de ${turno.nombre_mascota} para el ${fechaStr} a las ${horaStr}. ¡Los esperamos!`;
                            abrirWhatsApp(turno.telefono_dueno, msg);
                          }}
                          title="Enviar Recordatorio"
                          className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                        >
                          📱
                        </button>
                      </div>

                      {/* BOTONES DE ACCIÓN (Solo si está pendiente) */}
                      {turno.estado === 'Pendiente' && (
                        <div className="absolute top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                          <button
                            onClick={(e) => { e.stopPropagation(); iniciarCobro(turno); }}
                            title="Cobrar y Finalizar"
                            className="text-gray-400 hover:text-green-500 font-bold p-1"
                          >
                            ✔
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); cancelarTurno(turno.id); }}
                            title="Cancelar"
                            className="text-gray-400 hover:text-red-500 font-bold p-1"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    <h4 className={`font-black text-sm leading-tight mt-2 ${turno.estado !== 'Pendiente' ? 'text-gray-400 line-through decoration-2' : 'text-gray-800'}`}>
                      {turno.nombre_mascota}
                    </h4>
                    <p className="text-xs font-bold text-perru-hotpink mb-0.5">
                      ✂ {turno.servicio || 'Varios'}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">{turno.nombre_dueno}</p>

                    {turno.estado !== 'Pendiente' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg mt-2 inline-block font-bold uppercase tracking-wider ${turno.estado === 'Finalizado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
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