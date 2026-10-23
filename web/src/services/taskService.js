/**
 * @module taskService
 * @description Servicio que gestiona todas las operaciones relacionadas con tareas en el sistema.
 * Proporciona funcionalidades para crear, actualizar, mover y consultar tareas.
 */

import { tasks } from '../data/tasks'
import { columns } from '../data/columns'
import { delay } from '../utils/asyncUtils'

export const taskService = {
  /**
   * Crea una nueva tarea en una columna específica de un tablero
   * @async
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna
   * @param {Object} taskData - Datos de la tarea a crear
   * @param {string} taskData.title - Título de la tarea
   * @param {string} [taskData.description] - Descripción de la tarea
   * @param {string} [taskData.priority] - Prioridad de la tarea
   * @param {string} [taskData.dueDate] - Fecha de vencimiento
   * @param {Array<string>} [taskData.assignedMembers] - IDs de usuarios asignados
   * @param {Array<string>} [taskData.labels] - Etiquetas de la tarea
   * @param {number} [taskData.timeEstimation] - Estimación de tiempo en horas
   * @param {string} userId - ID del usuario que crea la tarea
   * @returns {Promise<Object>} La tarea creada
   * @throws {Error} Si el tablero o la columna no existen
   */
  async createTask(boardId, columnId, taskData, userId) {
    await delay(300)
    if (!columns[boardId]) throw new Error('Board not found')
    const column = columns[boardId].find((c) => c.id === columnId)
    if (!column) throw new Error('Column not found')

    if (!tasks[boardId]) {
      tasks[boardId] = {}
    }

    const now = new Date().toISOString()
    const taskId = `task-${Date.now()}`
    const newTask = {
      id: taskId,
      ...taskData,
      assignedMembers: taskData.assignedMembers ? [...taskData.assignedMembers] : [],
      labels: taskData.labels ? [...taskData.labels] : [],
      timeEstimation: taskData.timeEstimation || 0,
      completed: false,
      checklist: null,
      comments: [],
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    }

    tasks[boardId][taskId] = newTask
    column.taskIds.push(taskId)
    return newTask
  },

  /**
   * Actualiza una tarea existente
   * @async
   * @param {string} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @param {Object} taskData - Nuevos datos de la tarea
   * @returns {Promise<Object>} La tarea actualizada
   * @throws {Error} Si la tarea no existe
   */
  async updateTask(boardId, taskId, taskData) {
    await delay(300)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Task not found')
    }

    const task = tasks[boardId][taskId]
    Object.assign(task, {
      ...taskData,
      labels: taskData.labels ? [...taskData.labels] : task.labels,
      assignedMembers: taskData.assignedMembers ? [...taskData.assignedMembers] : task.assignedMembers,
      updatedAt: new Date().toISOString(),
    })
    return task
  },

  /**
   * Mueve una tarea de una columna a otra
   * @async
   * @param {string} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @param {string} sourceColumnId - ID de la columna origen
   * @param {string} targetColumnId - ID de la columna destino
   * @returns {Promise<Object>} La tarea movida
   * @throws {Error} Si el tablero, las columnas o la tarea no existen
   */
  async moveTask(boardId, taskId, sourceColumnId, targetColumnId) {
    await delay(300)
    if (!columns[boardId]) throw new Error('Board not found')
    const sourceColumn = columns[boardId].find((c) => c.id === sourceColumnId)
    const targetColumn = columns[boardId].find((c) => c.id === targetColumnId)

    if (!sourceColumn || !targetColumn) throw new Error('Column not found')

    const taskIndex = sourceColumn.taskIds.indexOf(taskId)
    if (taskIndex === -1) throw new Error('Task not found')

    sourceColumn.taskIds.splice(taskIndex, 1)
    targetColumn.taskIds.push(taskId)

    const task = tasks[boardId][taskId]
    task.updatedAt = new Date().toISOString()
    return task
  },

  /**
   * Obtiene todas las tareas de una columna específica
   * @async
   * @param {string} boardId - ID del tablero
   * @param {Object} column - Objeto de la columna
   * @param {Array<string>} column.taskIds - Array de IDs de tareas en la columna
   * @returns {Promise<Array<Object>>} Array de tareas en la columna
   */
  async getTasksForColumn(boardId, column) {
    await delay(300)
    const boardTasks = tasks[boardId] || {}
    return column.taskIds.map((taskId) => boardTasks[taskId]).filter(Boolean)
  },

  /**
   * Elimina una tarea de un tablero y su columna
   * @async
   * @param {string} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @param {string} columnId - ID de la columna que contiene la tarea
   * @returns {Promise<boolean>} true si se eliminó correctamente
   * @throws {Error} Si el tablero, la columna o la tarea no existen
   */
  async deleteTask(boardId, taskId, columnId) {
    await delay(300)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Task not found')
    }

    if (!columns[boardId]) throw new Error('Board not found')
    const column = columns[boardId].find((c) => c.id === columnId)
    if (!column) throw new Error('Column not found')

    // Eliminar la tarea de la columna
    const taskIndex = column.taskIds.indexOf(taskId)
    if (taskIndex === -1) throw new Error('Task not found in column')
    column.taskIds.splice(taskIndex, 1)

    // Eliminar la tarea del almacenamiento
    delete tasks[boardId][taskId]
    return true
  },
}
