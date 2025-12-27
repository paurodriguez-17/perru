import { useState, useEffect } from 'react';

const ModalProducto = ({ isOpen, onClose, productoEditar, recargar }) => {
    const [form, setForm] = useState({
        codigo: '', nombre: '', categoria: 'Alimento', precio: '', stock: '', stock_minimo: 5
    });

    useEffect(() => {
        if (productoEditar) {
            setForm(productoEditar);
        } else {
            setForm({ codigo: '', nombre: '', categoria: 'Alimento', precio: '', stock: '', stock_minimo: 5 });
        }
    }, [productoEditar, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = productoEditar
            ? `/api/productos/${productoEditar.id}`
            : '/api/productos';

        const method = productoEditar ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            recargar();
            onClose();
        } catch (error) { console.error(error); }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-md">
                {/* Header */}
                <div className="bg-perru-orange p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-black">{productoEditar ? '✏️ Editar Producto' : '🦴 Nuevo Producto'}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-orange-100 font-bold">×</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="label-perru">Nombre del Producto</label>
                        <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="input-perru" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-perru">Código</label>
                            <input value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} className="input-perru" placeholder="Opcional" />
                        </div>
                        <div>
                            <label className="label-perru">Categoría</label>
                            <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="select-perru">
                                <option>Alimento</option>
                                <option>Juguetes</option>
                                <option>Accesorios</option>
                                <option>Farmacia</option>
                                <option>Higiene</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-perru">Precio ($)</label>
                            <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} className="input-perru" required />
                        </div>
                        <div>
                            <label className="label-perru">Stock</label>
                            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input-perru" required />
                        </div>
                    </div>

                    <button className="w-full bg-perru-orange text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-orange-400 transition-all active:scale-95 mt-2">
                        Guardar
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ModalProducto;