// utils/scheduler.js
import cron from 'node-cron';

// Función para programar tareas diarias a una hora específica
export function programarTareaDiaria(hora, minuto, callback) {
    const cronExpression = `${minuto} ${hora} * * *`;
    console.log(`Programando tarea diaria a las ${hora}:${minuto}...`);
    
    // Programar tarea
    return cron.schedule(cronExpression, callback);
}