import { useState, useEffect } from 'react';
import ModalNuevoCliente from '../components/ModalNuevoCliente';
import ModalDetalleMascota from '../components/ModalDetalleMascota';

const FichasTecnicas = () => {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAltaAbierto, setModalAltaAbierto] = useState(false);
    const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

    const cargarDatos = async () => {
        try {
            const res = await fetch('/api/mascotas');
            const data = await res.json();
            setClientes(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { cargarDatos(); }, []);

    const abrirDetalle = (mascota) => {
        setMascotaSeleccionada(mascota);
        setModalDetalleAbierto(true);
    };

    const clientesFiltrados = clientes.filter(c =>
        c.nombre_dueno.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // LÓGICA DE COLOR SEGÚN COMPORTAMIENTO
    const getCardStyle = (comportamiento) => {
        switch (comportamiento) {
            case 'Rojo': return 'border-l-4 border-red-500 bg-red-50/50';
            case 'Amarillo': return 'border-l-4 border-yellow-500 bg-yellow-50/50';
            default: return 'border-l-4 border-green-500 bg-white'; // Verde por defecto
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Fichas Técnicas</h1>
                <button
                    onClick={() => setModalAltaAbierto(true)}
                    className="bg-perru-hotpink hover:bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-perru-pink/40 flex items-center gap-2 transition-transform active:scale-95"
                >
                    <span className="text-xl font-black">+</span> Nuevo Cliente
                </button>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center">
                <span className="text-gray-400 ml-3">🔍</span>
                <input type="text" placeholder="Buscar perro o dueño..." className="w-full p-2 outline-none text-gray-600" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clientesFiltrados.map((item) => (
                    <div key={item.id} className={`rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${getCardStyle(item.comportamiento)}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{item.nombre_dueno}</h3>
                                {item.instagram_user && <p className="text-xs text-indigo-500">@{item.instagram_user}</p>}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm gap-1">
                                <span>📞</span><span>{item.telefono_dueno || '-'}</span>
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-lg p-3 flex justify-between items-center border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {item.nombre.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{item.nombre}</p>
                                    <p className="text-xs text-gray-500">{item.raza}</p>
                                </div>
                            </div>
                            <button onClick={() => abrirDetalle(item)} className="text-gray-400 hover:text-indigo-600 p-2 text-xl transition-colors">👁️</button>
                        </div>
                    </div>
                ))}
            </div>

            <ModalNuevoCliente isOpen={modalAltaAbierto} onClose={() => setModalAltaAbierto(false)} recargar={cargarDatos} />
            <ModalDetalleMascota isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} mascota={mascotaSeleccionada} alGuardar={cargarDatos} />
        </div>
    );
};
export default FichasTecnicas;