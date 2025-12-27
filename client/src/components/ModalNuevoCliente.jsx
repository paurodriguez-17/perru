import { useState } from 'react';

const ModalNuevoCliente = ({ isOpen, onClose, recargar }) => {
    const [form, setForm] = useState({
        nombre_dueno: '', telefono: '', instagram: '',
        nombre: '', raza: '', tamano: 'Pequeño',
        fecha_nacimiento: '', comportamiento: 'Verde',
        frecuencia_estimada: 30,
        castrado: false, vacunas_al_dia: false,
        restriccion_alimentaria: '',
        fecha_ultima_desparasitacion: '', metodo_antipulgas: '', patologia: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resDueno = await fetch('/api/duenos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_completo: form.nombre_dueno,
                    telefono: form.telefono,
                    instagram_user: form.instagram
                })
            });
            const dataDueno = await resDueno.json();

            if (resDueno.ok) {
                await fetch('/api/mascotas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dueno_id: dataDueno.id, ...form })
                });
                alert('✅ Cliente creado con éxito');
                recargar();
                onClose();
            }
        } catch (error) { console.error(error); alert('Error al guardar'); }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-3xl max-h-[90vh]">

                {/* HEADER BONITO */}
                <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-gray-700">✨ Nuevo Cliente</h2>
                        <p className="text-sm text-perru-purple font-bold">Alta de dueño y mascota</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 font-bold text-xl transition-colors">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 bg-white">

                    {/* SECCIÓN DUEÑO */}
                    <div className="bg-perru-bg p-6 rounded-3xl border border-perru-pink/20">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-white p-2 rounded-xl text-lg shadow-sm">👤</span>
                            <h3 className="font-bold text-perru-hotpink uppercase tracking-wide text-sm">Datos del Humano</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="label-perru">Nombre y Apellido</label>
                                <input name="nombre_dueno" className="input-perru" onChange={handleChange} required placeholder="Ej: Juan Pérez" />
                            </div>
                            <div>
                                <label className="label-perru">Teléfono</label>
                                <input name="telefono" className="input-perru" onChange={handleChange} placeholder="Solo números" />
                            </div>
                            <div>
                                <label className="label-perru">Instagram</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-400 font-bold"></span>
                                    <input name="instagram" className="input-perru pl-8" onChange={handleChange} placeholder="usuario" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN MASCOTA */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <span className="bg-perru-mint/20 p-2 rounded-xl text-lg text-perru-mint">🐾</span>
                            <h3 className="font-bold text-gray-400 uppercase tracking-wide text-sm">Datos del Peludo</h3>
                        </div>

                        <div className="grid grid-cols-6 gap-5">
                            <div className="col-span-2"><label className="label-perru">Nombre</label><input name="nombre" className="input-perru" onChange={handleChange} required /></div>
                            <div className="col-span-2"><label className="label-perru">Raza</label><input name="raza" className="input-perru" onChange={handleChange} /></div>
                            <div className="col-span-2">
                                <label className="label-perru">Tamaño</label>
                                <select name="tamano" className="select-perru" onChange={handleChange}>
                                    <option>Pequeño</option><option>Mediano</option><option>Grande</option><option>Gigante</option>
                                </select>
                            </div>

                            <div className="col-span-2"><label className="label-perru">Nacimiento</label><input type="date" name="fecha_nacimiento" className="input-perru" onChange={handleChange} /></div>

                            <div className="col-span-2">
                                <label className="label-perru">Comportamiento</label>
                                <select name="comportamiento" className="select-perru" onChange={handleChange}>
                                    <option value="Verde">Verde (Amor)</option>
                                    <option value="Amarillo">Amarillo (Cuidado)</option>
                                    <option value="Rojo">Rojo (Peligro)</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="label-perru">Visita cada:</label>
                                <div className="relative">
                                    <input type="number" name="frecuencia_estimada" defaultValue={30} className="input-perru pr-12" onChange={handleChange} />
                                    <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400 uppercase">Días</span>
                                </div>
                            </div>

                            {/* Checkboxes con estilo de Botón */}
                            <div className="col-span-6 flex gap-4">
                                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 hover:border-perru-mint transition-colors w-full">
                                    <input type="checkbox" name="castrado" className="w-5 h-5 text-perru-mint rounded-md focus:ring-perru-mint" onChange={handleChange} />
                                    <span className="font-bold text-gray-600 text-sm">✂️ Castrado</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 hover:border-perru-mint transition-colors w-full">
                                    <input type="checkbox" name="vacunas_al_dia" className="w-5 h-5 text-perru-mint rounded-md focus:ring-perru-mint" onChange={handleChange} />
                                    <span className="font-bold text-gray-600 text-sm">💉 Vacunas al día</span>
                                </label>
                            </div>

                            {/* Alergias Rojo */}
                            <div className="col-span-6">
                                <label className="label-perru text-red-400">⚠️ Alergias / Restricciones</label>
                                <input name="restriccion_alimentaria" className="input-perru border-red-100 bg-red-50/50 text-red-600 placeholder-red-200 focus:border-red-300 focus:ring-red-100" placeholder="Escribir aquí si tiene alergias..." onChange={handleChange} />
                            </div>

                            <div className="col-span-3"><label className="label-perru">Última Desparasitación</label><input type="date" name="fecha_ultima_desparasitacion" className="input-perru" onChange={handleChange} /></div>
                            <div className="col-span-3"><label className="label-perru">Método Pulgas</label><input name="metodo_antipulgas" className="input-perru" placeholder="Ej: Pipeta" onChange={handleChange} /></div>

                            <div className="col-span-6"><label className="label-perru">Notas Extra</label><input name="patologia" className="input-perru" placeholder="Algo más que debamos saber..." onChange={handleChange} /></div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-8 py-3 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-colors">Cancelar</button>
                        <button type="submit" className="px-8 py-3 rounded-2xl bg-perru-hotpink text-white font-bold hover:bg-pink-500 shadow-lg shadow-pink-200 transition-transform active:scale-95">Guardar Cliente</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalNuevoCliente;