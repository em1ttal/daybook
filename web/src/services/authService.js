/**
 * @module authService
 * @description Servicio que gestiona la autenticación de usuarios en el sistema.
 * Proporciona funcionalidades para iniciar sesión, cerrar sesión y verificar el estado de autenticación.
 */
import { delay } from '../utils/asyncUtils'

/**
 * @type {Array<Object>}
 * @description Datos mock de usuarios para desarrollo
 * @private
 */
const MOCK_USERS = [{ email: 'demo@example.com', password: 'demo123', name: 'Demo User' }]

export const authService = {
  /**
   * Inicia sesión con credenciales de usuario
   * @async
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Objeto con el estado de éxito y datos del usuario
   * @throws {Error} Si las credenciales son inválidas
   */
  async login(email, password) {
    // Simulate API call delay
    await delay(800)

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      // Simulate JWT token
      const token = btoa(JSON.stringify({ id: 1, email: user.email, name: user.name }))
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify({ email: user.email, name: user.name }))
      return { success: true, user }
    }

    throw new Error('Credenciales inválidas')
  },

  /**
   * Cierra la sesión del usuario actual
   * @async
   * @returns {Promise<void>}
   */
  async logout() {
    await delay(300)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean} true si hay un usuario autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  /**
   * Obtiene los datos del usuario actualmente autenticado
   * @returns {Object|null} Datos del usuario o null si no hay sesión
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}
