import { useState, useEffect } from 'react';

const ModalTurno = ({ isOpen, onClose, alGuardar }) => {
    const [mascotas, setMascotas] = useState([]);

    // Estados separados para fecha y hora (Lógica original)
    const [idMascota, setIdMascota] = useState('');
    const [fechaDia, setFechaDia] = useState('');
    const [horaSeleccionada, setHoraSeleccionada] = useState('');
    const [servicio, setServicio] = useState('');
    const [notas, setNotas] = useState('');

    // Generador de horarios (Lógica original)
    const horariosDisponibles = [];
    for (let i = 9; i < 19; i++) {
        const horaStr = i < 10 ? `0${i}` : i;
        horariosDisponibles.push(`${horaStr}:00`);
        horariosDisponibles.push(`${horaStr}:30`);
    }

    useEffect(() => {
        if (isOpen) {
            fetch('/api/mascotas')
                .then(res => res.json())
                .then(data => setMascotas(data))
                .catch(err => console.error(err));

            if (!fechaDia) {
                setFechaDia(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!horaSeleccionada) {
            alert('Por favor selecciona un horario.');
            return;
        }
        const fechaFinal = `${fechaDia}T${horaSeleccionada}:00`;
        const nuevoTurno = {
            mascota_id: idMascota,
            fecha_turno: fechaFinal,
            servicio: servicio,
            observaciones_extra: notas
        };

        try {
            const res = await fetch('/api/turnos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoTurno)
            });

            if (res.ok) {
                alGuardar();
                cerrarYLimpiar();
            } else {
                alert('❌ Error al guardar');
            }
        } catch (error) { console.error(error); }
    };

    const cerrarYLimpiar = () => {
        setIdMascota('');
        setServicio('');
        setHoraSeleccionada('');
        setNotas('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-lg">

                {/* Header Estilo Perruquería */}
                <div className="bg-perru-hotpink px-6 py-5 flex justify-between items-center text-white">
                    <h2 className="text-xl font-black">📅 Agendar Nuevo Turno</h2>
                    <button onClick={onClose} className="text-2xl hover:text-pink-200 font-bold">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* 1. Selección de Mascota */}
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

                    {/* 2. Fecha y Servicio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-perru">Día</label>
                            <input
                                type="date"
                                className="input-perru"
                                value={fechaDia}
                                onChange={(e) => setFechaDia(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label-perru">Servicio</label>
                            <input
                                list="servicios-sugeridos"
                                type="text"
                                className="input-perru"
                                placeholder="Ej: Baño y Corte"
                                value={servicio}
                                onChange={(e) => setServicio(e.target.value)}
                                required
                            />
                            <datalist id="servicios-sugeridos">
                                <option value="Baño y Corte" />
                                <option value="Solo Baño" />
                                <option value="Corte Higiénico" />
                                <option value="Deslanado" />
                            </datalist>
                        </div>
                    </div>

                    {/* 3. Horario */}
                    <div>
                        <label className="label-perru">Horario de Inicio</label>
                        <input
                            type="time"
                            className="input-perru font-mono text-lg text-center tracking-widest"
                            value={horaSeleccionada}
                            onChange={(e) => setHoraSeleccionada(e.target.value)}
                            required
                        />
                    </div>

                    {/* 4. Notas */}
                    <div>
                        <label className="label-perru">Notas (Opcional)</label>
                        <textarea
                            className="input-perru"
                            rows="2"
                            placeholder="Ej: Cuidado con la pata derecha..."
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={cerrarYLimpiar}
                            className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-perru-hotpink text-white rounded-2xl font-black hover:bg-pink-500 shadow-lg shadow-perru-pink/40 transition-transform active:scale-95"
                        >
                            Confirmar Turno
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalTurno;