/**
 * @module labels
 * @description Base de datos mock que contiene las etiquetas predeterminadas y personalizadas por tablero.
 * Las etiquetas se utilizan para categorizar y organizar tareas en los tableros.
 */

/**
 * @type {Array<string>}
 * @description Colores predeterminados para las etiquetas en formato hexadecimal.
 * Incluye una paleta básica de colores: verde, amarillo, naranja, rojo, morado y azul.
 */
export const defaultLabels = [
  '#61BD4F', // Verde
  '#F2D600', // Amarillo
  '#FF9F1A', // Naranja
  '#EB5A46', // Rojo
  '#C377E0', // Morado
  '#0079BF', // Azul
]

/**
 * @type {Map<string|number, Array<Object>>}
 * @description Almacenamiento de etiquetas personalizadas por tablero.
 * Cada tablero puede tener su propio conjunto de etiquetas con nombres y colores personalizados.
 * @property {string} label.id - ID único de la etiqueta
 * @property {string} label.name - Nombre descriptivo de la etiqueta
 * @property {string} label.color - Color de la etiqueta en formato hex
 */
export const boardLabels = new Map()
