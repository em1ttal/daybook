/**
 * @module labelService
 * @description Servicio que gestiona todas las operaciones relacionadas con etiquetas en los tableros.
 * Proporciona funcionalidades para obtener, crear, actualizar y eliminar etiquetas.
 */

import { defaultLabels, boardLabels } from '../data/labels'
import { delay } from '../utils/asyncUtils'

export const labelService = {
  /**
   * Obtiene todas las etiquetas de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Array<Object>>} Lista de etiquetas del tablero o etiquetas por defecto
   */
  async getLabels(boardId) {
    await delay(300)
    return boardLabels.get(boardId) || [...defaultLabels]
  },

  /**
   * Actualiza las etiquetas de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {Array<Object>} labels - Nueva lista de etiquetas
   * @returns {Promise<Array<Object>>} Lista actualizada de etiquetas
   */
  async updateLabels(boardId, labels) {
    await delay(300)
    boardLabels.set(boardId, [...labels])
    return labels
  },

  /**
   * Añade una nueva etiqueta a un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {Object} label - Nueva etiqueta a añadir
   * @param {string} label.id - ID único de la etiqueta
   * @param {string} label.name - Nombre de la etiqueta
   * @param {string} label.color - Color de la etiqueta en formato hex
   * @returns {Promise<Array<Object>>} Lista actualizada de etiquetas
   */
  async addLabel(boardId, label) {
    await delay(300)
    const currentLabels = await this.getLabels(boardId)
    const newLabels = [...currentLabels, label]
    return this.updateLabels(boardId, newLabels)
  },

  /**
   * Elimina una etiqueta de un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @param {string} labelId - ID de la etiqueta a eliminar
   * @returns {Promise<Array<Object>>} Lista actualizada de etiquetas
   */
  async deleteLabel(boardId, labelId) {
    await delay(300)
    const currentLabels = await this.getLabels(boardId)
    const updatedLabels = currentLabels.filter((label) => label.id !== labelId)
    return this.updateLabels(boardId, updatedLabels)
  },
}
