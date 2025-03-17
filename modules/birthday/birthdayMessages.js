// modules/birthday/birthdayMessages.js
import { enviarMensaje } from '../../utils/whatsapp.js';

// Función para generar mensaje de cumpleaños
export function generarMensajeCumpleaños(nombre) {
    return `¡Feliz cumpleaños, ${nombre}! 🎉🎂 Todos los miembros del club de fútbol te deseamos un día maravilloso.`;
}

// Función para enviar mensaje de verificación al administrador
export async function enviarMensajeAdmin(sock) {
    const mensaje = `EL PROGRAMA ESTÁ ANDANDO Y SE PUEDE ENVIAR MENSAJES`;
    return await enviarMensaje(sock, "59898125703", mensaje);
}

// Función para enviar mensajes de cumpleaños
export async function enviarMensajesDeCumpleaños(sock, cumpleañeros) {
    console.log(`Encontrados ${cumpleañeros.length} cumpleañeros hoy.`);

    for (const socio of cumpleañeros) {
        const mensaje = generarMensajeCumpleaños(socio.nombre);
        await enviarMensaje(sock, socio.telefono, mensaje);
    }
}