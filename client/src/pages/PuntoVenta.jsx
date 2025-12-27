import { useState, useEffect } from 'react';

const PuntoVenta = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [medioPago, setMedioPago] = useState('Efectivo');
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');

    // Cargar productos
    useEffect(() => {
        fetch('/api/productos').then(res => res.json()).then(data => setProductos(data));
    }, []);

    // Lógica Carrito
    const agregarAlCarrito = (prod) => {
        if (prod.stock <= 0) return alert('❌ No hay stock disponible');
        const existe = carrito.find(i => i.id === prod.id);

        if (existe) {
            if (existe.cantidad < prod.stock) {
                setCarrito(carrito.map(i => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i));
            } else { alert('Stock máximo alcanzado'); }
        } else {
            setCarrito([...carrito, { ...prod, cantidad: 1 }]);
        }
    };

    const modificarCantidad = (id, d) => {
        setCarrito(carrito.map(i => {
            if (i.id === id) {
                const nuevaCant = i.cantidad + d;
                if (nuevaCant < 1) return i; // No bajar de 1
                if (nuevaCant > i.stock) return i; // No subir más del stock real
                return { ...i, cantidad: nuevaCant };
            }
            return i;
        }));
    };

    const quitarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    const procesarCobro = async () => {
        if (carrito.length === 0) return;
        if (!window.confirm('¿Confirmar Venta?')) return;

        try {
            await fetch('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: carrito,
                    total: carrito.reduce((a, i) => a + i.precio * i.cantidad, 0),
                    medio_pago: medioPago
                })
            });
            alert('✅ ¡Venta Exitosa!');
            setCarrito([]);
            // Recargar stock actualizado
            fetch('/api/productos').then(res => res.json()).then(data => setProductos(data));
        } catch (error) { console.error(error); }
    };

    // Filtros
    const productosFiltrados = productos.filter(p => {
        const txt = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.codigo && p.codigo.includes(busqueda));
        const cat = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
        return txt && cat;
    });

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6 p-2">

            {/* IZQUIERDA: CATÁLOGO */}
            <div className="flex-1 flex flex-col bg-white rounded-[2rem] shadow-sm border border-perru-pink/20 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex gap-4 bg-white">
                    <input type="text" placeholder="🔍 Buscar..." className="input-perru flex-1" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                    <div className="w-48">
                        <select className="select-perru" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
                            <option value="Todas">Categorías</option><option>Alimento</option><option>Juguetes</option><option>Accesorios</option><option>Farmacia</option><option>Higiene</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-perru-bg">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {productosFiltrados.map(p => (
                            <div key={p.id} onClick={() => agregarAlCarrito(p)}
                                className={`bg-white p-4 rounded-3xl shadow-sm border border-white hover:shadow-lg hover:border-perru-pink/30 cursor-pointer transition-all active:scale-95 relative group ${p.stock === 0 ? 'opacity-50 grayscale pointer-events-none' : ''}`}>

                                <span className={`absolute top-3 right-3 text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-wide ${p.categoria === 'Alimento' ? 'bg-orange-100 text-orange-500' : p.categoria === 'Juguetes' ? 'bg-purple-100 text-purple-500' : 'bg-pink-100 text-pink-500'
                                    }`}>{p.categoria}</span>

                                <div className="h-14 w-14 bg-perru-bg text-perru-hotpink rounded-2xl flex items-center justify-center text-2xl font-black mb-3 group-hover:bg-perru-hotpink group-hover:text-white transition-colors mt-2">
                                    {p.nombre.charAt(0)}
                                </div>
                                <h3 className="font-bold text-gray-700 text-sm leading-tight mb-1 truncate">{p.nombre}</h3>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-black text-gray-800">${parseFloat(p.precio).toLocaleString()}</span>
                                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${p.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>Stock: {p.stock}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DERECHA: CARRITO */}
            <div className="w-full md:w-96 bg-white rounded-[2rem] shadow-xl border border-perru-pink/20 flex flex-col">
                <div className="p-6 border-b border-gray-50 bg-perru-hotpink text-white flex justify-between items-center rounded-t-[2rem]">
                    <h2 className="text-xl font-black">🛒 Carrito</h2>
                    <span className="bg-white/20 px-3 py-1 rounded-xl text-sm font-bold">{carrito.reduce((a, b) => a + b.cantidad, 0)} items</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                    {carrito.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <span className="text-5xl mb-2 opacity-50">🛍️</span>
                            <p className="font-bold">Vacío</p>
                        </div>
                    ) : (
                        carrito.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
                                <div className="flex-1 overflow-hidden pr-2">
                                    <p className="font-bold text-gray-700 text-sm truncate">{item.nombre}</p>
                                    <p className="text-xs text-gray-400 font-bold">${parseFloat(item.precio).toLocaleString()} x {item.cantidad}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => modificarCantidad(item.id, -1)} className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">-</button>
                                    <span className="text-sm font-black w-4 text-center">{item.cantidad}</span>
                                    <button onClick={() => modificarCantidad(item.id, 1)} className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">+</button>
                                </div>
                                <button onClick={() => quitarDelCarrito(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-white rounded-b-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-400">Total</span>
                        <span className="font-black text-3xl text-gray-800">${carrito.reduce((a, i) => a + i.precio * i.cantidad, 0).toLocaleString()}</span>
                    </div>
                    <select className="select-perru mb-4 bg-gray-50" value={medioPago} onChange={e => setMedioPago(e.target.value)}>
                        <option>Efectivo</option>
                        <option>Transferencia</option>
                    </select>
                    <button onClick={procesarCobro} disabled={carrito.length === 0} className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 ${carrito.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-perru-mint text-teal-800 hover:bg-teal-300'}`}>
                        ¡Cobrar! 💰
                    </button>
                </div>
            </div>
        </div>
    );
};
export default PuntoVenta;