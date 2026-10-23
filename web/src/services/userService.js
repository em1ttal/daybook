/**
 * @module userService
 * @description Servicio que gestiona todas las operaciones relacionadas con usuarios en el sistema.
 * Proporciona funcionalidades para obtener, buscar y gestionar usuarios y sus relaciones con tableros.
 */

import { users } from '../data/users'
import { boards } from '../data/boards'
import { delay } from '../utils/asyncUtils'

export const userService = {
  /**
   * Obtiene el usuario actualmente autenticado
   * @async
   * @returns {Promise<Object>} Usuario actual
   */
  async getCurrentUser() {
    // Simular usuario actual (para desarrollo)
    await delay(300)
    return users[0]
  },

  /**
   * Obtiene un usuario por su ID
   * @async
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   * @throws {Error} Si el usuario no existe
   */
  async getUserById(userId) {
    await delay(300)
    const user = users.find((u) => u.id === userId)
    if (!user) throw new Error('User not found')
    return user
  },

  /**
   * Obtiene múltiples usuarios por sus IDs
   * @async
   * @param {string[]} userIds - Array de IDs de usuarios
   * @returns {Promise<Array<Object>>} Array de usuarios encontrados
   */
  async getUsersByIds(userIds) {
    await delay(300)
    return users.filter((user) => userIds.includes(user.id))
  },

  /**
   * Obtiene todos los usuarios del sistema
   * @async
   * @returns {Promise<Array<Object>>} Lista de todos los usuarios
   */
  async getUsers() {
    await delay(300)
    return [...users]
  },

  /**
   * Busca usuarios por nombre o rol
   * @async
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array<Object>>} Lista de usuarios que coinciden con la búsqueda
   */
  async searchUsers(query) {
    await delay(300)
    const searchTerm = query.toLowerCase()
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm),
    )
  },

  /**
   * Obtiene los miembros de un tablero específico
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Array<Object>>} Lista de usuarios miembros del tablero
   * @throws {Error} Si el tablero no existe
   */
  async getBoardMembers(boardId) {
    await delay(300)
    const board = boards.find((b) => b.id === boardId)
    if (!board) throw new Error('Tablero no encontrado')
    return users.filter((user) => board.members.includes(user.id))
  },

  /**
   * Añade un usuario como miembro de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} userId - ID del usuario a añadir
   * @returns {Promise<Object>} El tablero actualizado
   * @throws {Error} Si el tablero no existe
   */
  async addBoardMember(boardId, userId) {
    await delay(300)
    const board = boards.find((b) => b.id === boardId)
    if (!board) throw new Error('Tablero no encontrado')
    if (!board.members.includes(userId)) {
      board.members.push(userId)
    }
    return board
  },

  /**
   * Elimina un usuario como miembro de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} userId - ID del usuario a eliminar
   * @returns {Promise<Object>} El tablero actualizado
   * @throws {Error} Si el tablero no existe o si se intenta eliminar al propietario
   */
  async removeBoardMember(boardId, userId) {
    await delay(300)
    const board = boards.find((b) => b.id === boardId)
    if (!board) throw new Error('Tablero no encontrado')
    if (board.owner === userId) throw new Error('No se puede eliminar al propietario del tablero')
    board.members = board.members.filter((id) => id !== userId)
    return board
  },
}
