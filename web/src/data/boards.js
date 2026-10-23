/**
 * @module boards
 * @description Base de datos mock que contiene todos los tableros del sistema.
 * Cada tablero representa un proyecto o área de trabajo compartida entre usuarios.
 *
 * @typedef {Object} Board
 * @property {number} id - ID único del tablero
 * @property {string} title - Nombre del tablero
 * @property {string} description - Descripción detallada del tablero
 * @property {Date} lastActivity - Fecha de última actividad en el tablero
 * @property {string[]} members - Array de IDs de usuarios miembros del tablero
 * @property {string} owner - ID del usuario propietario del tablero
 */

/** @type {Board[]} */
export const boards = [
  {
    id: 1,
    title: 'Proyecto Website',
    description:
      'Desarrollo del nuevo sitio web corporativo con funcionalidades avanzadas de e-commerce',
    lastActivity: new Date('2024-03-10'),
    members: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    owner: 'user-1',
  },
  {
    id: 2,
    title: 'Marketing Q1',
    description: 'Campañas de marketing para el primer trimestre',
    lastActivity: new Date('2024-03-09'),
    members: ['user-1', 'user-2'],
    owner: 'user-2',
  },
]
