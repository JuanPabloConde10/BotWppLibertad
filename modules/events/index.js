// modules/events/index.js
import { cargarSocios } from '../../utils/database.js';
import { enviarMensaje,enviarMensajeConFoto } from '../../utils/whatsapp.js';

// Función para generar mensaje de evento
export function generarMensajeEvento() {
    return `📣 *EVENTO DEL CLUB* 📣`;
}

// Función para enviar notificación de evento a todos los socios
export async function enviarNotificacionEvento(sock) {
    const socios = cargarSocios();
    const mensaje = generarMensajeEvento();
    
    console.log(`Enviando notificación de evento a ${socios.length} socios...`);
    
    let enviados = 0;
    let fallidos = 0;
    
    for (const socio of socios) {
        const resultado = await enviarMensaje(sock, socio.telefono, mensaje);
        if (resultado) {
            enviados++;
        } else {
            fallidos++;
        }
    }
    
    console.log(`Notificación de evento enviada. Éxitos: ${enviados}, Fallidos: ${fallidos}`);
    return { enviados, fallidos };
}

export async function enviarNotificacionEventoConFoto(sock) {
    const socios = cargarSocios();
    const mensaje = generarMensajeEvento();
    const rutaFoto = "./fotos/evento.jpeg";

    
    console.log(`Enviando notificación de evento a ${socios.length} socios...`);
    
    let enviados = 0;
    let fallidos = 0;
    
    for (const socio of socios) {
        const resultado = await enviarMensajeConFoto(sock, socio.telefono, rutaFoto ,mensaje);
        if (resultado) {
            enviados++;
        } else {
            fallidos++;
        }
    }
    
    console.log(`Notificación de evento enviada. Éxitos: ${enviados}, Fallidos: ${fallidos}`);
    return { enviados, fallidos };
}