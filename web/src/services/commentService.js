/**
 * @module commentService
 * @description Servicio que gestiona todas las operaciones relacionadas con comentarios en las tareas.
 * Proporciona funcionalidades para añadir, eliminar y obtener comentarios de las tareas.
 */

import { tasks } from '../data/tasks'
import { delay } from '../utils/asyncUtils'

export const commentService = {
  /**
   * Añade un nuevo comentario a una tarea
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @param {string} commentText - Texto del comentario
   * @param {string} userId - ID del usuario que crea el comentario
   * @returns {Promise<Object>} El comentario creado
   * @throws {Error} Si la tarea no existe
   */
  async addComment(boardId, taskId, commentText, userId) {
    await delay(300)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Task not found')
    }

    const task = tasks[boardId][taskId]
    const comment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      author: userId,
      createdAt: new Date().toISOString(),
    }

    if (!task.comments) {
      task.comments = []
    }
    task.comments.push(comment)
    task.updatedAt = comment.createdAt
    return comment
  },

  /**
   * Elimina un comentario de una tarea
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @param {string} commentId - ID del comentario a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   * @throws {Error} Si la tarea o el comentario no existen
   */
  async deleteComment(boardId, taskId, commentId) {
    await delay(300)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Task not found')
    }

    const task = tasks[boardId][taskId]
    const commentIndex = task.comments.findIndex((c) => c.id === commentId)
    if (commentIndex === -1) throw new Error('Comment not found')
    task.comments.splice(commentIndex, 1)
    task.updatedAt = new Date().toISOString()
    return true
  },

  /**
   * Obtiene todos los comentarios de una tarea
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} taskId - ID de la tarea
   * @returns {Promise<Array<Object>>} Lista de comentarios de la tarea
   * @throws {Error} Si la tarea no existe
   */
  async getComments(boardId, taskId) {
    await delay(300)
    if (!tasks[boardId] || !tasks[boardId][taskId]) {
      throw new Error('Tarea no encontrada')
    }
    return tasks[boardId][taskId].comments || []
  },
}
