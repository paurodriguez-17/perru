import { useState, useEffect } from 'react';

const ModalDetalleMascota = ({ isOpen, onClose, mascota, alGuardar }) => {
    const [activeTab, setActiveTab] = useState('clinicos');
    const [historial, setHistorial] = useState([]);
    const [formData, setFormData] = useState({});
    const [edad, setEdad] = useState('');
    const [nuevaVisita, setNuevaVisita] = useState({
        fecha_visita: new Date().toISOString().split('T')[0],
        tipo_corte: '', shampoo: '', alza_utilizada: '', observaciones: ''
    });

    useEffect(() => {
        if (mascota && isOpen) {
            setFormData({
                ...mascota,
                fecha_nacimiento: mascota.fecha_nacimiento ? mascota.fecha_nacimiento.split('T')[0] : '',
                fecha_ultima_desparasitacion: mascota.fecha_ultima_desparasitacion ? mascota.fecha_ultima_desparasitacion.split('T')[0] : '',
                metodo_antipulgas: mascota.metodo_antipulgas || '',
                restriccion_alimentaria: mascota.restriccion_alimentaria || '',
                patologia: mascota.patologia || '',
                nombre_dueno: mascota.nombre_dueno || '',
                telefono_dueno: mascota.telefono_dueno || '',
                instagram_user: mascota.instagram_user || '',
                frecuencia_estimada: mascota.frecuencia_estimada || 30
            });
            calcularEdad(mascota.fecha_nacimiento);
            cargarHistorial(mascota.id);
        }
    }, [mascota, isOpen]);

    const calcularEdad = (fecha) => {
        if (fecha) {
            const hoy = new Date();
            const nac = new Date(fecha);
            let e = hoy.getFullYear() - nac.getFullYear();
            const m = hoy.getMonth() - nac.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) { e--; }
            setEdad(`${e} años`);
        } else { setEdad('-'); }
    };

    const cargarHistorial = async (id) => {
        try {
            const res = await fetch(`/api/historial/${id}`);
            const data = await res.json();
            setHistorial(data);
        } catch (error) { console.error(error); }
    };

    const handleSaveGeneral = async () => {
        try {
            await fetch(`/api/mascotas/${mascota.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            await fetch(`/api/duenos/${mascota.dueno_id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre_completo: formData.nombre_dueno, telefono: formData.telefono_dueno, instagram_user: formData.instagram_user }) });
            alert('✅ Datos actualizados'); alGuardar(); onClose();
        } catch (error) { console.error(error); }
    };

    const handleAgregarHistorial = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/historial', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...nuevaVisita, mascota_id: mascota.id }) });
            if (res.ok) { cargarHistorial(mascota.id); setNuevaVisita({ ...nuevaVisita, tipo_corte: '', shampoo: '', alza_utilizada: '', observaciones: '' }); }
        } catch (error) { console.error(error); }
    };

    if (!isOpen || !mascota) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-4xl h-[90vh]">

                {/* HEADER */}
                <div className="px-8 py-6 border-b border-gray-100 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-gray-800">{formData.nombre}</h2>
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide ${formData.comportamiento === 'Rojo' ? 'bg-red-100 text-red-600' :
                            formData.comportamiento === 'Amarillo' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                            }`}>
                            {formData.comportamiento}
                        </span>
                        <span className="text-gray-400 font-bold text-sm bg-gray-50 px-3 py-1 rounded-lg">Edad: {edad}</span>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 font-bold text-xl transition-colors">×</button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-gray-100 px-8 gap-6 bg-white">
                    <button onClick={() => setActiveTab('clinicos')} className={`pb-4 pt-4 font-bold text-sm border-b-4 rounded-t-lg transition-colors px-2 ${activeTab === 'clinicos' ? 'border-perru-hotpink text-perru-hotpink' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>📄 Datos y Dueño</button>
                    <button onClick={() => setActiveTab('historial')} className={`pb-4 pt-4 font-bold text-sm border-b-4 rounded-t-lg transition-colors px-2 ${activeTab === 'historial' ? 'border-perru-hotpink text-perru-hotpink' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>⏱️ Historial</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    {activeTab === 'clinicos' && (
                        <div className="space-y-8">

                            {/* SECCIÓN DUEÑO */}
                            <div className="bg-perru-bg p-6 rounded-3xl border border-perru-pink/20 relative mt-2">
                                <span className="absolute -top-3 left-6 bg-white px-3 py-1 text-[10px] font-black tracking-widest text-perru-hotpink border border-perru-pink/20 rounded-lg shadow-sm">DATOS DEL DUEÑO</span>
                                <div className="grid grid-cols-3 gap-5 mt-2">
                                    <div><label className="label-perru">Nombre</label><input value={formData.nombre_dueno} onChange={(e) => setFormData({ ...formData, nombre_dueno: e.target.value })} className="input-perru" /></div>
                                    <div><label className="label-perru">Teléfono</label><input value={formData.telefono_dueno} onChange={(e) => setFormData({ ...formData, telefono_dueno: e.target.value })} className="input-perru" /></div>
                                    <div><label className="label-perru">Instagram</label><input value={formData.instagram_user} onChange={(e) => setFormData({ ...formData, instagram_user: e.target.value })} className="input-perru" /></div>
                                </div>
                            </div>

                            {/* SECCIÓN MASCOTA */}
                            <div>
                                <h3 className="label-perru text-gray-400 mb-4">Perfil de Mascota</h3>
                                <div className="grid grid-cols-4 gap-5 mb-5">
                                    <div><label className="label-perru">Raza</label><input value={formData.raza} onChange={(e) => setFormData({ ...formData, raza: e.target.value })} className="input-perru" /></div>
                                    <div>
                                        <label className="label-perru">Tamaño</label>
                                        <select value={formData.tamano} onChange={(e) => setFormData({ ...formData, tamano: e.target.value })} className="select-perru">
                                            <option>Pequeño</option><option>Mediano</option><option>Grande</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-perru">Comportamiento</label>
                                        <select value={formData.comportamiento} onChange={(e) => setFormData({ ...formData, comportamiento: e.target.value })} className="select-perru">
                                            <option value="Verde">Verde</option><option value="Amarillo">Amarillo</option><option value="Rojo">Rojo</option>
                                        </select>
                                    </div>
                                    <div><label className="label-perru">Nacimiento</label><input type="date" value={formData.fecha_nacimiento} onChange={(e) => { setFormData({ ...formData, fecha_nacimiento: e.target.value }); calcularEdad(e.target.value); }} className="input-perru" /></div>
                                </div>

                                <div className="flex items-center gap-6 mb-5">
                                    <div className="w-48">
                                        <label className="label-perru">Frecuencia (Días)</label>
                                        <input type="number" value={formData.frecuencia_estimada} onChange={(e) => setFormData({ ...formData, frecuencia_estimada: e.target.value })} className="input-perru" />
                                    </div>
                                    <div className="flex items-center gap-4 pt-5 w-full">
                                        <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 hover:border-perru-mint transition-colors w-full justify-center">
                                            <input type="checkbox" checked={!!formData.castrado} onChange={(e) => setFormData({ ...formData, castrado: e.target.checked ? 1 : 0 })} className="w-5 h-5 text-perru-mint rounded-md" />
                                            <span className="font-bold text-gray-600 text-xs">✂️ Castrado</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 hover:border-perru-mint transition-colors w-full justify-center">
                                            <input type="checkbox" checked={!!formData.vacunas_al_dia} onChange={(e) => setFormData({ ...formData, vacunas_al_dia: e.target.checked ? 1 : 0 })} className="w-5 h-5 text-perru-mint rounded-md" />
                                            <span className="font-bold text-gray-600 text-xs">💉 Vacunas</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="label-perru text-red-400">Alergias</label>
                                    <input value={formData.restriccion_alimentaria} onChange={(e) => setFormData({ ...formData, restriccion_alimentaria: e.target.value })} className="input-perru border-red-100 bg-red-50/50 text-red-600" />
                                </div>

                                <div className="grid grid-cols-2 gap-5 mb-5">
                                    <div><label className="label-perru">Desparasitación</label><input type="date" value={formData.fecha_ultima_desparasitacion} onChange={(e) => setFormData({ ...formData, fecha_ultima_desparasitacion: e.target.value })} className="input-perru" /></div>
                                    <div><label className="label-perru">Método Pulgas</label><input value={formData.metodo_antipulgas} onChange={(e) => setFormData({ ...formData, metodo_antipulgas: e.target.value })} className="input-perru" /></div>
                                </div>

                                <div><label className="label-perru">Notas</label><textarea value={formData.patologia} onChange={(e) => setFormData({ ...formData, patologia: e.target.value })} className="input-perru" rows="2"></textarea></div>
                            </div>

                            <button onClick={handleSaveGeneral} className="w-full bg-perru-hotpink text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-pink-500 transition-all active:scale-95">💾 Guardar Cambios</button>
                        </div>
                    )}

                    {activeTab === 'historial' && (
                        <div>
                            <form onSubmit={handleAgregarHistorial} className="bg-perru-bg p-6 rounded-3xl border border-perru-pink/20 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-perru-hotpink font-black text-lg flex items-center gap-2"><span>+</span> Nueva Visita</h3>
                                    <input type="date" className="input-perru w-auto py-1" value={nuevaVisita.fecha_visita} onChange={(e) => setNuevaVisita({ ...nuevaVisita, fecha_visita: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <input placeholder="✂️ Corte (Ej: Bebé)" className="input-perru" value={nuevaVisita.tipo_corte} onChange={(e) => setNuevaVisita({ ...nuevaVisita, tipo_corte: e.target.value })} />
                                    <input placeholder="💧 Shampoo" className="input-perru" value={nuevaVisita.shampoo} onChange={(e) => setNuevaVisita({ ...nuevaVisita, shampoo: e.target.value })} />
                                    <input placeholder="📏 Alza" className="input-perru" value={nuevaVisita.alza_utilizada} onChange={(e) => setNuevaVisita({ ...nuevaVisita, alza_utilizada: e.target.value })} />
                                </div>
                                <input placeholder="Observaciones extra..." className="input-perru mb-4" value={nuevaVisita.observaciones} onChange={(e) => setNuevaVisita({ ...nuevaVisita, observaciones: e.target.value })} />
                                <button type="submit" className="w-full bg-perru-purple text-white py-3 rounded-2xl font-bold shadow-md hover:bg-purple-400">Agregar al Historial</button>
                            </form>

                            <div className="space-y-4">
                                {historial.map(h => (
                                    <div key={h.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-gray-700">Visita General</span>
                                            <span className="text-xs bg-gray-100 px-3 py-1 rounded-lg text-gray-500 font-bold">{new Date(h.fecha_visita).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm text-gray-600 mb-3">
                                            {h.tipo_corte && <span className="bg-perru-bg px-3 py-1 rounded-lg text-perru-hotpink font-bold">✂ {h.tipo_corte}</span>}
                                            {h.shampoo && <span className="bg-blue-50 px-3 py-1 rounded-lg text-blue-500 font-bold">💧 {h.shampoo}</span>}
                                            {h.alza_utilizada && <span className="bg-orange-50 px-3 py-1 rounded-lg text-orange-500 font-bold">📏 {h.alza_utilizada}</span>}
                                        </div>
                                        {h.observaciones && <p className="text-sm text-gray-400 italic border-t border-gray-50 pt-2">{h.observaciones}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ModalDetalleMascota;