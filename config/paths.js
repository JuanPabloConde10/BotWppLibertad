// config/paths.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Exportar rutas comunes
export const PATHS = {
    ROOT: ROOT_DIR,
    DATA: path.join(ROOT_DIR, 'data'),
    SOCIOS_DB_PATH: path.join(ROOT_DIR, 'data', 'socios.json'),
    AUTH_FOLDER: path.join(ROOT_DIR, 'data', 'auth_info_baileys')
};