/**
 * @module checklistService
 * @description Servicio que gestiona todas las operaciones relacionadas con checklists en las tareas.
 * Proporciona funcionalidades para crear, actualizar, eliminar y obtener checklists.
 */

import { tasks } from '../data/tasks'
import { delay } from '../utils/asyncUtils'

export const checklistService = {
  /**
   * Obtiene la checklist de una tarea
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @returns {Promise<Object>} La checklist de la tarea
   * @throws {Error} Si la tarea no existe
   */
  async getChecklist(boardId, taskId) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Task not found')
    }
    return tasks[boardId][taskId].checklist || null
  },

  /**
   * Crea una nueva checklist para una tarea
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @returns {Promise<void>} 
   */
  async createChecklist(boardId, taskId) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Task not found')
    }
    const task = tasks[boardId][taskId]
    task.checklist = {
      id: `checklist-${Date.now()}`,
      title: 'Checklist',
      items: [],
    }
  },

  /**
   * Añade un nuevo item a la checklist de una tarea
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @param {string} text - Texto del item
   * @returns {Promise<Object>} El item creado
   * @throws {Error} Si la tarea no existe
   */
  async addItem(boardId, taskId, text) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Task not found')
    }
    const task = tasks[boardId][taskId]
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
    }
    task.checklist.items.push(newItem)
    task.updatedAt = new Date().toISOString()
    return newItem
  },

  /**
   * Actualiza el texto de un item de la checklist
   * @async
   * @param {string|number} boardId
   * @param {string} taskId
   * @param {string} itemId
   * @param {string} newText
   * @returns {Promise<Object>} El item actualizado
   */
  async updateItem(boardId, taskId, itemId, newText) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) throw new Error('Task not found')
    const task = tasks[boardId][taskId]
    const item = task.checklist?.items.find((i) => i.id === itemId)
    if (!item) throw new Error('Item not found')
    item.text = newText
    task.updatedAt = new Date().toISOString()
    return item
  },

  /**
   * Elimina un item de la checklist
   * @async
   * @param {string|number} boardId
   * @param {string} taskId
   * @param {string} itemId
   * @returns {Promise<void>}
   */
  async deleteItem(boardId, taskId, itemId) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) throw new Error('Task not found')
    const task = tasks[boardId][taskId]
    if (!task.checklist) return
    task.checklist.items = task.checklist.items.filter((i) => i.id !== itemId)
    task.updatedAt = new Date().toISOString()
  },

  /**
   * Alterna el estado de completitud de un item
   * @async
   * @param {string|number} boardId
   * @param {string} taskId
   * @param {string} itemId
   * @returns {Promise<Object>} El item actualizado
   */
  async toggleItem(boardId, taskId, itemId) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) throw new Error('Task not found')
    const task = tasks[boardId][taskId]
    const item = task.checklist?.items.find((i) => i.id === itemId)
    if (!item) throw new Error('Item not found')
    item.completed = !item.completed
    task.updatedAt = new Date().toISOString()
    return item
  },

  /**
   * Actualiza el título de la checklist
   * @async
   * @param {string|number} boardId
   * @param {string} taskId
   * @param {string} newTitle
   * @returns {Promise<string>} El nuevo título
   */
  async updateTitle(boardId, taskId, newTitle) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) throw new Error('Task not found')
    const task = tasks[boardId][taskId]
    if (!task.checklist) throw new Error('Checklist not found')
    task.checklist.title = newTitle
    task.updatedAt = new Date().toISOString()
    return newTitle
  },

  /**
   * Reemplaza todos los items de la checklist (por ejemplo, para IA)
   * @async
   * @param {string|number} boardId
   * @param {string} taskId
   * @param {Array<Object>} items
   * @returns {Promise<Array<Object>>} Los nuevos items
   */
  async setItems(boardId, taskId, items) {
    await delay(200)
    if (!tasks[boardId] || !tasks[boardId][taskId]) throw new Error('Task not found')
    const task = tasks[boardId][taskId]
    if (!task.checklist) {
      task.checklist = {
        id: `checklist-${Date.now()}`,
        title: 'Checklist',
        items: [],
      }
    }
    task.checklist.items = items
    task.updatedAt = new Date().toISOString()
    return items
  },
}
