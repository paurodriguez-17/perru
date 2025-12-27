export const abrirWhatsApp = (telefono, mensaje) => {
    if (!telefono) {
        alert("El cliente no tiene teléfono registrado.");
        return;
    }

    let numeroLimpio = telefono.replace(/\D/g, '');

    if (!numeroLimpio.startsWith('54')) {
        numeroLimpio = '549' + numeroLimpio;
    }

    const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
};