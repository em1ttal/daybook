/**
 * @module columns
 * @description Base de datos mock que contiene todas las columnas de los tableros del sistema.
 * Las columnas están organizadas por tablero y representan el estado o etapa de las tareas.
 *
 * @typedef {Object} Column
 * @property {number} id - ID único de la columna
 * @property {string} title - Título de la columna
 * @property {Array<string>} taskIds - Array de IDs de las tareas en la columna
 */

import { tasks } from './tasks'

/**
 * @type {Object.<number, Column[]>}
 * Objeto que mapea IDs de tableros a sus arrays de columnas
 */
export const columns = {
  1: [
    {
      id: 1,
      title: 'Backlog',
      taskIds: ['task-1', 'task-2'],
    },
    {
      id: 2,
      title: 'En Progreso',
      taskIds: ['task-3'],
    },
    {
      id: 3,
      title: 'Blocked',
      taskIds: ['task-4'],
    },
    {
      id: 4,
      title: 'Sprint 1',
      taskIds: ['task-5', 'task-6', 'task-11', 'task-12', 'task-13'],
    },
    {
      id: 5,
      title: 'Sprint 2',
      taskIds: ['task-7', 'task-8', 'task-14', 'task-15', 'task-16'],
    },
    {
      id: 6,
      title: 'Sprint 3',
      taskIds: ['task-9', 'task-10'],
    },
  ],
}
