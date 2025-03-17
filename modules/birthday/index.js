// modules/birthday/index.js
import { obtenerCumpleañerosDeDia } from './birthdayChecker.js';
import { enviarMensajesDeCumpleaños, enviarMensajeAdmin } from './birthdayMessages.js';
import { programarTareaDiaria } from '../../utils/scheduler.js';

// Función para inicializar el módulo de cumpleaños
export function initBirthdayModule(sock) {
    // Programar verificación diaria
    return programarTareaDiaria(9, 0, () => {
        console.log('Ejecutando verificación programada de cumpleaños...');
        const cumpleañeros = obtenerCumpleañerosDeDia();
        enviarMensajesDeCumpleaños(sock, cumpleañeros);
        console.log('Enviando el mensaje al administrador...');
        enviarMensajeAdmin(sock);
    });
}

// Función para hacer una verificación inmediata
export async function verificarCumpleañosAhora(sock) {
    console.log('Realizando verificación inmediata de cumpleaños...');
    const cumpleañeros = obtenerCumpleañerosDeDia();
    await enviarMensajesDeCumpleaños(sock, cumpleañeros);
    await enviarMensajeAdmin(sock);
}

export { obtenerCumpleañerosDeDia };