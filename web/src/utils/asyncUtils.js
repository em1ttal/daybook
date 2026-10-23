/**
 * @module asyncUtils
 * @description Utilidades para operaciones asíncronas
 */

/**
 * Función de utilidad para simular un retraso en las operaciones asíncronas
 * @param {number} ms - Milisegundos de retraso
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
