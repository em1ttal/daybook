/**
 * @module users
 * @description Base de datos mock que contiene todos los usuarios del sistema.
 * Cada usuario representa un miembro del equipo con sus datos básicos y rol.
 *
 * @typedef {Object} User
 * @property {string} id - ID único del usuario
 * @property {string} name - Nombre completo del usuario
 * @property {string} avatar - URL del avatar del usuario (generado dinámicamente)
 * @property {string} role - Rol o cargo del usuario en el sistema
 */

/** @type {User[]} */
export const users = [
  {
    id: 'user-1',
    name: 'Ana García',
    avatar: 'https://ui-avatars.com/api/?name=Ana+García&background=random',
    role: 'Product Manager',
  },
  {
    id: 'user-2',
    name: 'Carlos López',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+López&background=random',
    role: 'Frontend Developer',
  },
  {
    id: 'user-3',
    name: 'María Rodríguez',
    avatar: 'https://ui-avatars.com/api/?name=María+Rodríguez&background=random',
    role: 'Backend Developer',
  },
  {
    id: 'user-4',
    name: 'David Sánchez',
    avatar: 'https://ui-avatars.com/api/?name=David+Sánchez&background=random',
    role: 'UI/UX Designer',
  },
  {
    id: 'user-5',
    name: 'Laura Martín',
    avatar: 'https://ui-avatars.com/api/?name=Laura+Martín&background=random',
    role: 'QA Engineer',
  },
]
