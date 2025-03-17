// Bot de WhatsApp para enviar mensajes usando Baileys
// Requiere Node.js instalado

// Primero, instala las dependencias con:
// npm install @whiskeysockets/baileys qrcode-terminal fs node-cron

import { conectarWhatsApp } from './utils/whatsapp.js';
import { initBirthdayModule, verificarCumpleañosAhora } from './modules/birthday/index.js';
import { enviarMensajeBienvenida } from './modules/welcome/index.js';
import { enviarNotificacionEvento } from './modules/events/index.js';
import { agregarSocio, listarSocios } from './utils/database.js';

// Función para inicializar todos los módulos cuando se establece la conexión
function inicializarModulos(sock) {
    // Inicializar módulo de cumpleaños
    //initBirthdayModule(sock);
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--enviar-bienvenidas')) {
    console.log('Enviando mensajes de bienvenida a socios pendientes...');
    conectarWhatsApp(async (sock) => {
        await enviarMensajeBienvenida(sock);
        console.log('Proceso de mensajes de bienvenida completado.');
        process.exit(0);
    });
} else if (args.includes('--listar-socios')) {
    const socios = listarSocios();
    console.table(socios);
} else if (args.includes('--verificar-cumpleaños')) {
    console.log('Iniciando verificación inmediata de cumpleaños...');
    conectarWhatsApp(async (sock) => {
        await verificarCumpleañosAhora(sock);
        console.log('Verificación completada.');
        process.exit(0);
    });
} else if (args.includes('--evento')) {
    const index = args.indexOf('--evento');
    const nombre = args[index + 1];
    const fecha = args[index + 2];
    const hora = args[index + 3];
    const descripcion = args[index + 4];

    if (nombre && fecha && hora && descripcion) {
        console.log('Enviando notificación de evento...');
        conectarWhatsApp(async (sock) => {
            await enviarNotificacionEvento(sock, nombre, fecha, hora, descripcion);
            console.log('Notificación de evento enviada.');
            process.exit(0);
        });
    } else {
        console.log('Uso: node index.js --evento "Nombre del Evento" "DD/MM/YYYY" "HH:MM" "Descripción del evento"');
    }
} else {
    // Iniciar el bot en modo normal
    const hoy = new Date();
    console.log('Iniciando bot de WhatsApp con Baileys...');
    console.log(`Fecha actual: ${hoy.toLocaleDateString()}`);
    conectarWhatsApp(inicializarModulos);
}