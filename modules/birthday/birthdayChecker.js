// modules/birthday/birthdayChecker.js
import { cargarSocios } from '../../utils/database.js';

// Función para obtener los cumpleañeros del día
export function obtenerCumpleañerosDeDia() {
    const socios = cargarSocios();
    const hoy = new Date();
    const fechaHoy = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}`;

    return socios.filter(socio => socio.fechaNacimiento === fechaHoy);
}