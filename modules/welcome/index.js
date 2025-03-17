// modules/welcome/index.js
import { cargarSocios } from '../../utils/database.js';
import { enviarMensaje } from '../../utils/whatsapp.js';
import fs from 'fs';
import { PATHS } from '../../config/paths.js';

// Función para generar mensaje de bienvenida
export function generarMensajeBienvenida(nombre) {
    return `Te damos la bienvenida a una nueva temporada deportiva del Club A. Libertad. \n\nGracias por el apoyo y por ser parte del más grande. \n\nVamos por todo!!! 🔵⚪️`;
}

// Función para enviar mensaje de bienvenida a todos los socios pendientes
export async function enviarMensajeBienvenida(sock) {
    // Cargar socios de la base de datos
    const socios = cargarSocios();
    
    // Filtrar socios que no han recibido mensaje de bienvenida
    const sociosPendientes = socios.filter(socio => socio.msjBienvenidaSend === false);
    
    console.log(`Enviando mensajes de bienvenida a ${sociosPendientes.length} socios pendientes...`);
    
    let enviados = 0;
    let errores = 0;
    
    // Enviar mensajes a cada socio pendiente
    for (const socio of sociosPendientes) {
        try {
            // Generar mensaje personalizado
            const mensaje = generarMensajeBienvenida(socio.nombre);
            
            // Intentar enviar el mensaje
            console.log(`Enviando mensaje de bienvenida a ${socio.nombre}...`);
            const resultado = await enviarMensaje(sock, socio.telefono, mensaje);
            
            if (resultado) {
                // Actualizar el estado del socio en la lista
                socio.msjBienvenidaSend = true;
                enviados++;
                console.log(`Mensaje enviado correctamente a ${socio.nombre}`);
            } else {
                errores++;
                console.error(`Error al enviar mensaje a ${socio.nombre}`);
            }
        } catch (error) {
            errores++;
            console.error(`Error al procesar mensaje para ${socio.nombre}:`, error);
        }
    }
    
    // Guardar la base de datos actualizada
    fs.writeFileSync(PATHS.SOCIOS_DB_PATH, JSON.stringify(socios, null, 2));
    
    console.log(`Proceso completado. Mensajes enviados: ${enviados}, Errores: ${errores}`);
    
    return {
        total: sociosPendientes.length,
        enviados,
        errores
    };
}