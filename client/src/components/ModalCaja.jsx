import { useState } from 'react';

const ModalCaja = ({ isOpen, onClose, alGuardar }) => {
    const [tipo, setTipo] = useState('Ingreso');
    const [origen, setOrigen] = useState('Peluqueria'); // <--- Nuevo selector
    const [monto, setMonto] = useState('');
    const [concepto, setConcepto] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoMovimiento = {
            tipo,
            origen, // Enviamos lo que elijas
            monto: parseFloat(monto),
            concepto,
            medio_pago: 'Efectivo'
        };

        try {
            const res = await fetch('/api/caja', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoMovimiento)
            });

            if (res.ok) {
                alGuardar();
                cerrarYLimpiar();
            } else {
                alert('Error al guardar');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const cerrarYLimpiar = () => {
        setMonto('');
        setConcepto('');
        setOrigen('Peluqueria'); // Volver al default
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">💰 Nuevo Movimiento</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* 1. Selector TIPO (Ingreso / Gasto) */}
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            type="button"
                            onClick={() => setTipo('Ingreso')}
                            className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${tipo === 'Ingreso' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Ingreso (+)
                        </button>
                        <button
                            type="button"
                            onClick={() => setTipo('Egreso')}
                            className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${tipo === 'Egreso' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Gasto (-)
                        </button>
                    </div>

                    {/* 2. Selector ORIGEN (Peluqueria / PetShop) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sector</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg w-full hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="origen"
                                    value="Peluqueria"
                                    checked={origen === 'Peluqueria'}
                                    onChange={(e) => setOrigen(e.target.value)}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">✂️ Peluquería</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg w-full hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="origen"
                                    value="PetShop"
                                    checked={origen === 'PetShop'}
                                    onChange={(e) => setOrigen(e.target.value)}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">🦴 Pet Shop</span>
                            </label>
                        </div>
                    </div>

                    {/* 3. Monto y Concepto */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monto ($)</label>
                        <input
                            type="number"
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-mono font-bold text-gray-700"
                            placeholder="0.00"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Concepto</label>
                        <input
                            type="text"
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ej: Venta Alimento 5kg..."
                            value={concepto}
                            onChange={(e) => setConcepto(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-black font-bold shadow-lg transition-all"
                    >
                        Guardar Movimiento
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalCaja;