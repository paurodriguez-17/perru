import { useState, useEffect } from 'react'
import ModalCaja from '../components/ModalCaja'

const Caja = () => {
    const [movimientos, setMovimientos] = useState([])
    const [modalAbierto, setModalAbierto] = useState(false)

    // Estados para los 3 saldos
    const [saldoTotal, setSaldoTotal] = useState(0)
    const [saldoPeluqueria, setSaldoPeluqueria] = useState(0)
    const [saldoPetShop, setSaldoPetShop] = useState(0)

    const cargarCaja = () => {
        fetch('/api/caja')
            .then(res => res.json())
            .then(data => {
                setMovimientos(data)
                calcularSaldos(data)
            })
            .catch(err => console.error(err))
    }

    // Lógica matemática (INTACTA)
    const calcularSaldos = (datos) => {
        let total = 0;
        let pelu = 0;
        let shop = 0;

        datos.forEach(m => {
            const valor = parseFloat(m.monto);
            const real = m.tipo === 'Ingreso' ? valor : -valor; // Si es gasto, resta

            total += real; // Suma al total general

            if (m.origen === 'Peluqueria') {
                pelu += real;
            } else if (m.origen === 'PetShop') {
                shop += real;
            }
        });

        setSaldoTotal(total);
        setSaldoPeluqueria(pelu);
        setSaldoPetShop(shop);
    }

    useEffect(() => {
        cargarCaja()
    }, [])

    return (
        <div className="min-h-screen p-4 md:p-8"> {/* Padding y fondo ajustado */}

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-700">💰 Finanzas</h1>
                <button
                    onClick={() => setModalAbierto(true)}
                    className="bg-perru-hotpink hover:bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-perru-pink/40 transition-transform active:scale-95 flex items-center gap-2"
                >
                    <span>+</span> Registrar Movimiento
                </button>
            </div>

            {/* --- TARJETAS DE SALDOS (Redondeadas y con colores pasteles) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Tarjeta 1: CAJA TOTAL */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-perru-pink/20 relative overflow-hidden">
                    {/* Tira de color decorativa pero redondeada */}
                    <div className={`absolute top-4 left-4 bottom-4 w-1.5 rounded-full ${saldoTotal >= 0 ? 'bg-gray-700' : 'bg-red-400'}`}></div>
                    <div className="pl-6">
                        <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-1">Caja General (Total)</p>
                        <h3 className={`text-4xl font-black ${saldoTotal >= 0 ? 'text-gray-700' : 'text-red-500'}`}>
                            ${saldoTotal.toLocaleString()}
                        </h3>
                    </div>
                </div>

                {/* Tarjeta 2: PELUQUERÍA */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-perru-pink/20 relative overflow-hidden">
                    <div className="absolute top-4 left-4 bottom-4 w-1.5 rounded-full bg-perru-purple"></div>
                    <div className="pl-6">
                        <p className="text-perru-purple text-xs font-black uppercase tracking-wider mb-1">✂️ Peluquería</p>
                        <h3 className="text-3xl font-black text-gray-700">${saldoPeluqueria.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Tarjeta 3: PET SHOP */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-perru-pink/20 relative overflow-hidden">
                    <div className="absolute top-4 left-4 bottom-4 w-1.5 rounded-full bg-perru-orange"></div>
                    <div className="pl-6">
                        <p className="text-perru-orange text-xs font-black uppercase tracking-wider mb-1">🦴 Pet Shop</p>
                        <h3 className="text-3xl font-black text-gray-700">${saldoPetShop.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <ModalCaja
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                alGuardar={cargarCaja}
            />

            {/* --- LISTA DE MOVIMIENTOS --- */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-perru-pink/20 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-perru-bg text-perru-purple text-xs font-black uppercase tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="p-5">Fecha</th>
                            <th className="p-5">Origen</th>
                            <th className="p-5">Concepto</th>
                            <th className="p-5">Tipo</th>
                            <th className="p-5 text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {movimientos.map(mov => (
                            <tr key={mov.id} className="hover:bg-perru-bg/50 transition-colors">
                                <td className="p-5 text-sm font-bold text-gray-500">
                                    {new Date(mov.fecha).toLocaleDateString()}
                                </td>
                                <td className="p-5">
                                    {/* ETIQUETA DE ORIGEN ESTILIZADA */}
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide border ${mov.origen === 'Peluqueria'
                                            ? 'bg-perru-purple/10 text-perru-purple border-perru-purple/20'
                                            : 'bg-perru-orange/10 text-perru-orange border-perru-orange/20'
                                        }`}>
                                        {mov.origen === 'Peluqueria' ? '✂️ Peluquería' : '🦴 Pet Shop'}
                                    </span>
                                </td>
                                <td className="p-5 font-bold text-gray-700">{mov.concepto}</td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-black ${mov.tipo === 'Ingreso'
                                            ? 'text-green-600 bg-green-50'
                                            : 'text-red-500 bg-red-50'
                                        }`}>
                                        {mov.tipo}
                                    </span>
                                </td>
                                <td className={`p-5 text-right font-black text-lg ${mov.tipo === 'Ingreso' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                    {mov.tipo === 'Ingreso' ? '+' : '-'}${parseFloat(mov.monto).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {movimientos.length === 0 && (
                    <div className="p-10 text-center text-gray-400 font-bold">
                        <p>No hay movimientos registrados.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Caja