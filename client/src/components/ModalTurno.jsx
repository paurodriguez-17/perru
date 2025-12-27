import { useState, useEffect } from 'react';

// Aceptamos una nueva prop: turnoEditar (puede ser null o un objeto turno)
const ModalTurno = ({ isOpen, onClose, alGuardar, turnoEditar = null }) => {
    const [mascotas, setMascotas] = useState([]);

    const [idMascota, setIdMascota] = useState('');
    const [fechaDia, setFechaDia] = useState('');
    const [horaSeleccionada, setHoraSeleccionada] = useState('');
    const [servicio, setServicio] = useState('');
    const [notas, setNotas] = useState('');

    // Generador de horarios
    const horariosDisponibles = [];
    for (let i = 9; i < 19; i++) {
        const horaStr = i < 10 ? `0${i}` : i;
        horariosDisponibles.push(`${horaStr}:00`);
        horariosDisponibles.push(`${horaStr}:30`);
    }

    useEffect(() => {
        if (isOpen) {
            // 1. Cargar mascotas
            fetch('/api/mascotas')
                .then(res => res.json())
                .then(data => setMascotas(data))
                .catch(err => console.error(err));

            // 2. Si estamos EDITANDO, rellenar campos
            if (turnoEditar) {
                setIdMascota(turnoEditar.mascota_id); // Asegúrate de traer mascota_id en el GET del backend

                // Parsear fecha y hora
                // Asumiendo formato ISO: "2023-12-25T14:30:00.000Z" o similar
                const fechaObj = new Date(turnoEditar.fecha_turno);

                // Ajuste simple para obtener YYYY-MM-DD local
                const year = fechaObj.getFullYear();
                const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
                const day = String(fechaObj.getDate()).padStart(2, '0');
                setFechaDia(`${year}-${month}-${day}`);

                // Ajuste para obtener HH:mm
                const hours = String(fechaObj.getHours()).padStart(2, '0');
                const minutes = String(fechaObj.getMinutes()).padStart(2, '0');
                setHoraSeleccionada(`${hours}:${minutes}`);

                setServicio(turnoEditar.servicio || '');
                setNotas(turnoEditar.observaciones_extra || '');
            } else {
                // MODO CREAR: Limpiar o setear defaults
                limpiarFormulario();
                setFechaDia(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, turnoEditar]);

    const limpiarFormulario = () => {
        setIdMascota('');
        setServicio('');
        setHoraSeleccionada('');
        setNotas('');
        setFechaDia(new Date().toISOString().split('T')[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!horaSeleccionada) {
            alert('Por favor selecciona un horario.');
            return;
        }

        const fechaFinal = `${fechaDia}T${horaSeleccionada}:00`;
        const datosTurno = {
            mascota_id: idMascota,
            fecha_turno: fechaFinal,
            servicio: servicio,
            observaciones_extra: notas
        };

        try {
            let res;
            if (turnoEditar) {
                // MODO EDICIÓN (PUT)
                res = await fetch(`/api/turnos/${turnoEditar.id}/editar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosTurno)
                });
            } else {
                // MODO CREACIÓN (POST)
                res = await fetch('/api/turnos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosTurno)
                });
            }

            if (res.ok) {
                alGuardar();
                cerrarYLimpiar();
            } else {
                alert('❌ Error al guardar');
            }
        } catch (error) { console.error(error); }
    };

    const cerrarYLimpiar = () => {
        limpiarFormulario();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-lg">
                <div className="bg-perru-hotpink px-6 py-5 flex justify-between items-center text-white">
                    <h2 className="text-xl font-black">
                        {turnoEditar ? '✏️ Reprogramar Turno' : '📅 Agendar Nuevo Turno'}
                    </h2>
                    <button onClick={cerrarYLimpiar} className="text-2xl hover:text-pink-200 font-bold">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* ... (INPUTS IGUAL QUE ANTES) ... */}

                    {/* Solo un ejemplo del input mascota para contexto, el resto es igual */}
                    <div>
                        <label className="label-perru">Mascota</label>
                        <select
                            className="select-perru"
                            value={idMascota}
                            onChange={(e) => setIdMascota(e.target.value)}
                            required
                        >
                            <option value="">-- Seleccionar Cliente --</option>
                            {mascotas.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre} (Dueño: {m.nombre_dueno})</option>
                            ))}
                        </select>
                    </div>

                    {/* REPETIR EL RESTO DE INPUTS (Día, Servicio, Horario, Notas) TAL CUAL TU CÓDIGO ORIGINAL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-perru">Día</label>
                            <input type="date" className="input-perru" value={fechaDia} onChange={(e) => setFechaDia(e.target.value)} required />
                        </div>
                        <div>
                            <label className="label-perru">Servicio</label>
                            <input list="servicios-sugeridos" type="text" className="input-perru" value={servicio} onChange={(e) => setServicio(e.target.value)} required />
                            <datalist id="servicios-sugeridos">
                                <option value="Baño y Corte" /><option value="Solo Baño" /><option value="Corte Higiénico" /><option value="Deslanado" />
                            </datalist>
                        </div>
                    </div>

                    <div>
                        <label className="label-perru">Horario de Inicio</label>
                        <input type="time" className="input-perru font-mono text-lg text-center tracking-widest" value={horaSeleccionada} onChange={(e) => setHoraSeleccionada(e.target.value)} required />
                    </div>

                    <div>
                        <label className="label-perru">Notas</label>
                        <textarea className="input-perru" rows="2" value={notas} onChange={(e) => setNotas(e.target.value)} />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={cerrarYLimpiar} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-1 py-3 bg-perru-hotpink text-white rounded-2xl font-black hover:bg-pink-500 shadow-lg shadow-perru-pink/40 transition-transform active:scale-95">
                            {turnoEditar ? 'Guardar Cambios' : 'Confirmar Turno'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalTurno;