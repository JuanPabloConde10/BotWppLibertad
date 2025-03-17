// utils/whatsapp.js
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import { PATHS } from '../config/paths.js';

// Función para asegurar que la carpeta de autenticación exista
function asegurarCarpetaAuth() {
    if (!fs.existsSync(PATHS.AUTH_FOLDER)) {
        fs.mkdirSync(PATHS.AUTH_FOLDER, { recursive: true });
    }
}

// Función para enviar mensaje a un número específico
export async function enviarMensaje(sock, telefono, mensaje) {
    try {
        // Formato del número: código de país + número sin el "+"
        const chatId = `${telefono}@s.whatsapp.net`;
        
        // Enviar mensaje
        await sock.sendMessage(chatId, { text: mensaje });
        console.log(`Mensaje enviado a ${telefono}`);
        return true;
    } catch (error) {
        console.error(`Error al enviar mensaje a ${telefono}:`, error);
        return false;
    }
}

// Función principal para iniciar el cliente de WhatsApp
export async function conectarWhatsApp(onConnectionOpen) {
    // Asegurar que la carpeta de autenticación exista
    asegurarCarpetaAuth();

    // Cargar estado de autenticación
    const { state, saveCreds } = await useMultiFileAuthState(PATHS.AUTH_FOLDER);

    // Crear socket de WhatsApp
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    // Guardar credenciales cuando se actualicen
    sock.ev.on('creds.update', saveCreds);

    // Manejar cambios de conexión
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('Escanea el código QR con tu WhatsApp:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) ?
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;

            console.log('Conexión cerrada debido a:', lastDisconnect?.error?.output?.payload?.message || 'Error desconocido');

            if (shouldReconnect) {
                console.log('Reconectando...');
                conectarWhatsApp(onConnectionOpen);
            } else {
                console.log('No se reconectará. Eliminando sesión...');
                // Eliminar archivos de autenticación para forzar un nuevo inicio de sesión
                if (fs.existsSync(PATHS.AUTH_FOLDER)) {
                    fs.rmSync(PATHS.AUTH_FOLDER, { recursive: true, force: true });
                }
            }
        } else if (connection === 'open') {
            console.log('Conexión establecida! El bot está en funcionamiento.');

            // Llamar al callback de conexión abierta
            if (typeof onConnectionOpen === 'function') {
                onConnectionOpen(sock);
            }
        }
    });

    return sock;
}