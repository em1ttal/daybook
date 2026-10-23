/**
 * @module aiService
 * @description Servicio que proporciona funcionalidades de inteligencia artificial para asistir en la gestión de tareas.
 * Incluye optimización de descripciones, generación de subtareas y estimación de tiempo.
 */

import { delay } from '../utils/asyncUtils'
/**
 * Función de utilidad para simular un retraso en las operaciones asíncronas
 * @param {number} ms - Milisegundos de retraso
 * @returns {Promise<void>}
 * @private
 */

export const aiService = {
  /**
   * Optimiza la descripción de una tarea añadiendo estructura y claridad
   * @async
   * @param {string} description - Descripción original de la tarea
   * @returns {Promise<string>} Descripción optimizada
   */
  async optimizeTaskDescription(description) {
    await delay(1000)
    // Simulación de optimización de descripción
    return `${description}\n\nOptimizado: Esta tarea ha sido analizada y estructurada para mayor claridad.`
  },

  /**
   * Genera subtareas automáticamente basadas en el título y descripción de una tarea
   * @async
   * @param {Object} taskData - Datos de la tarea
   * @param {string} taskData.title - Título de la tarea
   * @param {string} taskData.description - Descripción de la tarea
   * @returns {Promise<Array<Object>>} Lista de subtareas generadas
   * @property {string} id - ID único de la subtarea
   * @property {string} text - Texto descriptivo de la subtarea
   * @property {boolean} completed - Estado de completitud de la subtarea
   */
  async generateSubtasks({ title, description }) {
    await delay(1500)

    // Lista de subtareas generales que aplican a cualquier tipo de tarea
    const generalSubtasks = [
      'Investigar y recopilar información necesaria',
      'Planificar y definir alcance del trabajo',
      'Crear borrador inicial',
      'Revisar y refinar',
      'Solicitar feedback',
      'Implementar correcciones',
      'Realizar pruebas finales',
      'Documentar proceso y resultados',
      'Presentar entregable final',
    ]

    // Seleccionar aleatoriamente 4-6 subtareas
    const numTasks = Math.floor(Math.random() * 3) + 4 // 4 a 6 tareas
    const selectedTasks = []
    const usedIndexes = new Set()

    while (selectedTasks.length < numTasks && usedIndexes.size < generalSubtasks.length) {
      const index = Math.floor(Math.random() * generalSubtasks.length)
      if (!usedIndexes.has(index)) {
        usedIndexes.add(index)
        selectedTasks.push(generalSubtasks[index])
      }
    }

    // Generar las subtareas con IDs únicos
    return selectedTasks.map((text, index) => ({
      id: `item-${Date.now()}-${index}`,
      text,
      completed: false,
    }))
  },

  /**
   * Sugiere una estimación de tiempo para completar una tarea
   * @async
   * @param {Object} taskData - Datos de la tarea
   * @param {string} taskData.title - Título de la tarea
   * @param {string} taskData.description - Descripción de la tarea
   * @returns {Promise<number>} Estimación de tiempo en horas (redondeado a 0.5 más cercano)
   */
  async suggestTimeEstimation({ title, description }) {
    await delay(1000)

    // Crear un hash simple basado en el título y la descripción
    const content = title + description
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) - hash + content.charCodeAt(i)
      hash = hash & hash // Convertir a entero de 32 bits
    }

    // Usar el hash para generar una estimación consistente
    const baseEstimation = Math.abs(hash % 16) + 1 // 1-16 horas base

    // Redondear al 0.5 más cercano
    const finalEstimation = Math.round(baseEstimation * 2) / 2

    return finalEstimation
  },
}
