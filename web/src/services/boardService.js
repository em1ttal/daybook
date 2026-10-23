/**
 * @module boardService
 * @description Servicio que gestiona todas las operaciones relacionadas con tableros en el sistema.
 * Proporciona funcionalidades para crear, actualizar, eliminar y gestionar tableros y sus miembros.
 */

import { boards } from '../data/boards'
import { columns } from '../data/columns'
import { userService } from './userService'
import { delay } from '../utils/asyncUtils'

export const boardService = {
  /**
   * Obtiene todos los tableros del sistema
   * @async
   * @returns {Promise<Array<Object>>} Lista de todos los tableros
   */
  async getBoards() {
    await delay(300)
    return [...boards]
  },

  /**
   * Obtiene los detalles completos de un tablero, incluyendo sus columnas
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Object>} Detalles del tablero con sus columnas
   * @throws {Error} Si el tablero no existe
   */
  async getBoardDetails(boardId) {
    await delay(300)
    const board = boards.find((b) => b.id === boardId)
    if (!board) throw new Error('Board not found')

    return {
      ...board,
      columns: columns[boardId] || [],
    }
  },

  /**
   * Obtiene un tablero por su ID
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Object>} El tablero encontrado
   * @throws {Error} Si el tablero no existe
   */
  async getBoardById(boardId) {
    await delay(300)
    const board = boards.find((b) => b.id === boardId)
    if (!board) throw new Error('Board not found')
    return board
  },

  /**
   * Crea un nuevo tablero
   * @async
   * @param {Object} boardData - Datos del nuevo tablero
   * @param {string} boardData.title - Título del tablero
   * @param {string} [boardData.description] - Descripción del tablero
   * @param {string} [boardData.backgroundColor] - Color de fondo en formato hex
   * @param {string} userId - ID del usuario creador
   * @returns {Promise<Object>} El tablero creado
   */
  async createBoard(boardData, userId) {
    await delay(300)
    const newBoard = {
      id: Date.now(), // Usar timestamp como ID único
      title: boardData.title,
      description: boardData.description || '',
      backgroundColor: boardData.backgroundColor || '#1a1a2e',
      owner: userId,
      members: [userId],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    }

    boards.push(newBoard)

    // Inicializar columnas por defecto para el nuevo tablero
    columns[newBoard.id] = [
      {
        id: 1,
        title: 'To Do',
        taskIds: [],
      },
      {
        id: 2,
        title: 'In Progress',
        taskIds: [],
      },
      {
        id: 3,
        title: 'Done',
        taskIds: [],
      },
    ]

    return newBoard
  },

  /**
   * Actualiza un tablero existente
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>} El tablero actualizado
   * @throws {Error} Si el tablero no existe
   */
  async updateBoard(boardId, updates) {
    await delay(300)
    const board = await this.getBoardById(boardId)

    Object.assign(board, {
      ...updates,
      lastActivity: new Date().toISOString(),
    })

    return board
  },

  /**
   * Elimina un tablero y sus columnas asociadas
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<boolean>} true si se eliminó correctamente
   * @throws {Error} Si el tablero no existe
   */
  async deleteBoard(boardId) {
    await delay(300)
    const boardIndex = boards.findIndex((b) => b.id === boardId)
    if (boardIndex === -1) throw new Error('Board not found')

    boards.splice(boardIndex, 1)
    delete columns[boardId]
    return true
  },

  /**
   * Obtiene los miembros de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Array<Object>>} Lista de usuarios miembros
   * @throws {Error} Si el tablero no existe
   */
  async getBoardMembers(boardId) {
    await delay(300)
    const board = await this.getBoardById(boardId)
    return userService.getUsersByIds(board.members)
  },

  /**
   * Añade un nuevo miembro al tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} userId - ID del usuario a añadir
   * @returns {Promise<Object>} El tablero actualizado
   * @throws {Error} Si el tablero no existe
   */
  async addBoardMember(boardId, userId) {
    await delay(300)
    const board = await this.getBoardById(boardId)

    if (board.members.includes(userId)) {
      return board // El usuario ya es miembro
    }

    board.members.push(userId)
    board.lastActivity = new Date().toISOString()
    return board
  },

  /**
   * Elimina un miembro del tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} userId - ID del usuario a eliminar
   * @returns {Promise<Object>} El tablero actualizado
   * @throws {Error} Si el tablero no existe o si se intenta eliminar al propietario
   */
  async removeBoardMember(boardId, userId) {
    await delay(300)
    const board = await this.getBoardById(boardId)

    if (board.owner === userId) {
      throw new Error('Cannot remove board owner')
    }

    board.members = board.members.filter((id) => id !== userId)
    board.lastActivity = new Date().toISOString()
    return board
  },

  /**
   * Transfiere la propiedad del tablero a otro miembro
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} newOwnerId - ID del nuevo propietario
   * @returns {Promise<Object>} El tablero actualizado
   * @throws {Error} Si el tablero no existe o si el nuevo propietario no es miembro
   */
  async transferOwnership(boardId, newOwnerId) {
    await delay(300)
    const board = await this.getBoardById(boardId)

    if (!board.members.includes(newOwnerId)) {
      throw new Error('New owner must be a board member')
    }

    board.owner = newOwnerId
    board.lastActivity = new Date().toISOString()
    return board
  },

  /**
   * Obtiene información de actividad del tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Object>} Información de actividad
   * @throws {Error} Si el tablero no existe
   */
  async getBoardActivity(boardId) {
    await delay(300)
    const board = await this.getBoardById(boardId)

    return {
      createdAt: board.createdAt,
      lastActivity: board.lastActivity,
      totalMembers: board.members.length,
      owner: await userService.getUserById(board.owner),
    }
  },

  /**
   * Obtiene las columnas de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Array<Object>>} Lista de columnas del tablero
   */
  async getBoardColumns(boardId) {
    await delay(300)
    return columns[boardId] || []
  },
}
