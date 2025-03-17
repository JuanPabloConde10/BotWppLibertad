// modules/events/index.js
import { cargarSocios } from '../../utils/database.js';
import { enviarMensaje } from '../../utils/whatsapp.js';

// Función para generar mensaje de evento
export function generarMensajeEvento(nombreEvento, fecha, hora, descripcion) {
    return `📣 *EVENTO DEL CLUB* 📣
*${nombreEvento}*
📅 Fecha: ${fecha}
⏰ Hora: ${hora}
ℹ️ ${descripcion}

¡Te esperamos!`;
}

// Función para enviar notificación de evento a todos los socios
export async function enviarNotificacionEvento(sock, nombreEvento, fecha, hora, descripcion) {
    const socios = cargarSocios();
    const mensaje = generarMensajeEvento(nombreEvento, fecha, hora, descripcion);
    
    console.log(`Enviando notificación de evento "${nombreEvento}" a ${socios.length} socios...`);
    
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