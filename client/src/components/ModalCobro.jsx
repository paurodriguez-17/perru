import { useState, useEffect } from 'react';

const ModalCobro = ({ isOpen, onClose, turno, alConfirmar }) => {
    const [monto, setMonto] = useState('');
    const [metodo, setMetodo] = useState('Efectivo');

    useEffect(() => {
        if (isOpen) {
            setMonto('');
        }
    }, [isOpen]);

    const handleCobrar = async (e) => {
        e.preventDefault();

        // 1. Guardar en CAJA
        try {
            const movimiento = {
                tipo: 'Ingreso',
                origen: 'Peluqueria',
                concepto: `Cobro Turno: ${turno.nombre_mascota} (${turno.servicio})`,
                monto: parseFloat(monto),
                medio_pago: metodo,
                turno_id: turno.id
            };

            const resCaja = await fetch('/api/caja', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movimiento)
            });

            if (resCaja.ok) {
                // 2. Actualizar TURNO a 'Finalizado'
                await fetch(`/api/turnos/${turno.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estado: 'Finalizado' })
                });

                alConfirmar();
                onClose();
            } else {
                alert('Error al registrar en caja');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    };

    if (!isOpen || !turno) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-sm border-t-8 border-t-perru-mint">

                {/* Header Especial Cobro */}
                <div className="bg-perru-mint/20 p-6 text-center">
                    <h2 className="text-xl font-black text-teal-700 mb-1">💸 Cobrar Turno</h2>
                    <p className="text-sm font-bold text-teal-600">{turno.nombre_mascota}</p>
                    <p className="text-xs text-teal-500 uppercase tracking-wide">{turno.servicio}</p>
                </div>

                <form onSubmit={handleCobrar} className="p-8 space-y-5">

                    <div>
                        <label className="label-perru text-teal-600">Monto a Cobrar ($)</label>
                        <input
                            type="number"
                            className="input-perru text-3xl font-black text-center text-teal-700 placeholder-teal-200 border-teal-100 focus:border-teal-400 focus:ring-teal-100"
                            placeholder="0.00"
                            autoFocus
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="label-perru">Medio de Pago</label>
                        <select
                            className="select-perru"
                            value={metodo}
                            onChange={(e) => setMetodo(e.target.value)}
                        >
                            <option>Efectivo</option>
                            <option>Transferencia</option>
                            <option>Débito</option>
                            <option>Crédito</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-1 py-3 bg-perru-mint text-teal-800 font-black rounded-2xl hover:bg-teal-300 shadow-lg shadow-teal-100 transition-transform active:scale-95">
                            Confirmar ($)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCobro;