import { useState, useEffect } from 'react';
import ModalProducto from '../components/ModalProducto';

const Stock = () => {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [productoEditar, setProductoEditar] = useState(null);
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');

    // Cargar productos
    const cargarProductos = async () => {
        try {
            const res = await fetch('/api/productos');
            const data = await res.json();
            setProductos(data);
        } catch (error) { console.error(error); }
    };
    useEffect(() => { cargarProductos(); }, []);

    // Borrar producto
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de borrar este producto?')) return;
        await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        cargarProductos();
    };

    // Lógica de filtrado (Texto + Categoría)
    const productosFiltrados = productos.filter(p => {
        const matchText = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.codigo && p.codigo.includes(busqueda));
        const matchCat = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
        return matchText && matchCat;
    });

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-gray-700">🦴 Inventario</h1>
                <button
                    onClick={() => { setProductoEditar(null); setModalOpen(true); }}
                    className="bg-perru-orange hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-transform active:scale-95 w-full md:w-auto"
                >
                    + Nuevo Producto
                </button>
            </div>

            {/* Filtros Estilo Perru */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        className="input-perru pl-10"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        className="select-perru"
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                        <option value="Todas">Todas las categorías</option>
                        <option value="Alimento">Alimento</option>
                        <option value="Juguetes">Juguetes</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Farmacia">Farmacia</option>
                        <option value="Higiene">Higiene</option>
                    </select>
                </div>
            </div>

            {/* Tabla Responsive con Scroll */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-perru-pink/20 overflow-hidden">
                <div className="overflow-x-auto"> {/* <--- ESTO PERMITE EL SCROLL EN CELULAR */}
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-perru-bg text-perru-purple text-xs font-black uppercase tracking-wider">
                            <tr>
                                <th className="p-5">Producto</th>
                                <th className="p-5">Categoría</th>
                                <th className="p-5">Precio</th>
                                <th className="p-5">Stock</th>
                                <th className="p-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {productosFiltrados.map(prod => (
                                <tr key={prod.id} className="hover:bg-perru-bg/50 transition-colors">
                                    <td className="p-5">
                                        <p className="font-bold text-gray-700 whitespace-nowrap">{prod.nombre}</p>
                                        <p className="text-xs text-gray-400 font-medium">{prod.codigo || 'S/C'}</p>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase whitespace-nowrap ${prod.categoria === 'Alimento' ? 'bg-perru-orange/20 text-orange-600' :
                                                prod.categoria === 'Juguetes' ? 'bg-perru-purple/20 text-purple-600' :
                                                    prod.categoria === 'Accesorios' ? 'bg-perru-pink/20 text-pink-600' :
                                                        'bg-blue-50 text-blue-600'
                                            }`}>
                                            {prod.categoria}
                                        </span>
                                    </td>
                                    <td className="p-5 font-black text-gray-600 whitespace-nowrap">${parseFloat(prod.precio).toLocaleString()}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-black whitespace-nowrap ${prod.stock <= prod.stock_minimo ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600'
                                            }`}>
                                            {prod.stock} u.
                                        </span>
                                    </td>
                                    <td className="p-5 text-right space-x-2 whitespace-nowrap">
                                        <button onClick={() => { setProductoEditar(prod); setModalOpen(true); }} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors" title="Editar">✏️</button>
                                        <button onClick={() => handleDelete(prod.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Eliminar">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {productosFiltrados.length === 0 && (
                    <div className="p-8 text-center text-gray-400">No se encontraron productos.</div>
                )}
            </div>

            <ModalProducto
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                productoEditar={productoEditar}
                recargar={cargarProductos}
            />
        </div>
    );
};
export default Stock;