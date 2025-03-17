// utils/database.js
import fs from 'fs';
import { PATHS } from '../config/paths.js';

// Función para cargar la base de datos de socios
export function cargarSocios() {
    if (!fs.existsSync(PATHS.SOCIOS_DB_PATH)) {
        // Si no existe el archivo, crear una base de datos de ejemplo
        const sociosEjemplo = [
            { nombre: "Juan Pérez", telefono: "59898125703", fechaNacimiento: "01/03" },
            { nombre: "María López", telefono: "59898125703", fechaNacimiento: "01/03" },
            { nombre: "Carlos Gómez", telefono: "59898125703", fechaNacimiento: "01/03" }
        ];
        
        // Asegurarse de que el directorio existe
        if (!fs.existsSync(PATHS.DATA)) {
            fs.mkdirSync(PATHS.DATA, { recursive: true });
        }
        
        fs.writeFileSync(PATHS.SOCIOS_DB_PATH, JSON.stringify(sociosEjemplo, null, 2));
        return sociosEjemplo;
    }

    // Si existe, cargar desde el archivo
    const data = fs.readFileSync(PATHS.SOCIOS_DB_PATH, 'utf8');
    return JSON.parse(data);
}

// Función para agregar un nuevo socio
export function agregarSocio(nombre, telefono, fechaNacimiento) {
    const socios = cargarSocios();
    socios.push({ nombre, telefono, fechaNacimiento });
    fs.writeFileSync(PATHS.SOCIOS_DB_PATH, JSON.stringify(socios, null, 2));
    console.log(`Socio ${nombre} agregado con éxito`);
    return true;
}

// Función para listar todos los socios
export function listarSocios() {
    const socios = cargarSocios();
    return socios;
}