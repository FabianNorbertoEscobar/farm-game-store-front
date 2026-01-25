/**
 * Configuración centralizada del servicio de datos
 * Cambia entre mockService y firestore modificando una sola línea
 */

// ========== CONFIGURACIÓN ==========
// Cambia 'mockService' por 'firestore' para usar Firebase
const USE_SERVICE = 'firestore';
// ===================================

// Imports condicionales
import * as mockService from './mockService.js';
import * as firestore from './firestore.js';

// Seleccionar el servicio activo
const services = {
    mockService,
    firestore
};

const activeService = services[USE_SERVICE];

if (!activeService) {
    throw new Error(`Servicio "${USE_SERVICE}" no válido. Usa 'mockService' o 'firestore'`);
}

// Re-exportar todas las funciones del servicio activo
export const {
    default: getData,
    getItemData,
    getCategoryData,
    getCategories,
    searchByTitle,
    createBuyOrder,
    getOrders
} = activeService;

// Exportación por defecto
export default getData;

// Log para verificar qué servicio está activo (solo en desarrollo)
if (import.meta.env.DEV) {
    console.log(`📦 Servicio de datos activo: ${USE_SERVICE}`);
}
