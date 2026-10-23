/**
 * @module columnService
 * @description Servicio que gestiona todas las operaciones relacionadas con columnas en los tableros.
 * Proporciona funcionalidades para crear, actualizar, eliminar y gestionar columnas y sus tareas asociadas.
 */

import { columns } from '../data/columns'
import { tasks } from '../data/tasks'
import { delay } from '../utils/asyncUtils'

/**
 * Obtiene las tareas asociadas a una columna específica
 * @param {string|number} boardId - ID del tablero
 * @param {Object} column - Objeto de la columna
 * @param {Array<string>} column.taskIds - IDs de las tareas en la columna
 * @returns {Array<Object>} Array de tareas de la columna
 * @private
 */
const getTasksForColumn = (boardId, column) => {
  const boardTasks = tasks[boardId] || {}
  return column.taskIds.map((taskId) => boardTasks[taskId]).filter(Boolean)
}

export const columnService = {
  /**
   * Obtiene todas las columnas de un tablero con sus tareas
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Array<Object>>} Array de columnas con sus tareas
   */
  async getColumns(boardId) {
    await delay(300)
    const boardColumns = columns[boardId] || []
    return boardColumns.map((column) => ({
      ...column,
      tasks: getTasksForColumn(boardId, column),
    }))
  },

  /**
   * Actualiza la estructura de columnas de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {Array<Object>} newColumns - Nueva estructura de columnas
   * @param {string|number} newColumns[].id - ID de la columna
   * @param {string} newColumns[].title - Título de la columna
   * @param {Array<Object>} newColumns[].tasks - Tareas de la columna
   * @returns {Promise<Array<Object>>} Columnas actualizadas
   */
  async updateBoardColumns(boardId, newColumns) {
    await delay(300)
    // Extract taskIds from the new columns structure
    const updatedColumns = newColumns.map((column) => ({
      id: column.id,
      title: column.title,
      taskIds: column.tasks.map((task) => task.id),
    }))
    columns[boardId] = updatedColumns
    return newColumns
  },

  /**
   * Crea una nueva columna en un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {Object} columnData - Datos de la nueva columna
   * @param {string} columnData.title - Título de la columna
   * @returns {Promise<Object>} La columna creada con array de tareas vacío
   */
  async createColumn(boardId, columnTitle) {
    await delay(300)
    if (!columns[boardId]) {
      columns[boardId] = []
    }
    const newColumn = {
      id: Math.max(0, ...columns[boardId].map((c) => c.id)) + 1,
      title: columnTitle,
      taskIds: [],
    }
    columns[boardId].push(newColumn)
    return {
      ...newColumn,
      tasks: [],
    }
  },

  /**
   * Elimina una columna de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string|number} columnId - ID de la columna a eliminar
   * @returns {Promise<void>}
   */
  async deleteColumn(boardId, columnId) {
    await delay(300)
    if (!columns[boardId]) return
    const index = columns[boardId].findIndex((c) => c.id === columnId)
    if (index !== -1) {
      columns[boardId].splice(index, 1)
    }
  },
}
