/**
 * @module analyticsService
 * @description Servicio que proporciona funcionalidades de análisis y métricas para tableros y tareas.
 * Incluye cálculos de estadísticas, métricas de velocidad y línea de tiempo de actividades.
 */

import { tasks } from '../data/tasks'
import { columns } from '../data/columns'
import { taskService } from './taskService'
import { delay } from '../utils/asyncUtils'

export const analyticsService = {
  /**
   * Calcula estadísticas detalladas de las tareas en un tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Object>} Estadísticas del tablero
   * @property {number} totalTasks - Total de tareas en el tablero
   * @property {number} completedTasks - Número de tareas completadas
   * @property {number} blockedTasks - Número de tareas bloqueadas
   * @property {number} inProgressTasks - Número de tareas en progreso
   * @property {Object} tasksByPriority - Distribución de tareas por prioridad
   * @property {Object} tasksByMember - Estadísticas de tareas por miembro
   * @property {number} completionRate - Tasa de finalización en porcentaje
   * @property {Array<Object>} columnStats - Estadísticas detalladas por columna
   * @property {Object} timeStats - Estadísticas relacionadas con tiempo
   * @property {Object} recentActivity - Actividad reciente en el tablero
   * @throws {Error} Si el tablero no existe
   */
  async calculateTaskStats(boardId) {
    await delay(300)
    const boardColumns = columns[boardId] || []
    const boardTasks = tasks[boardId] || {}
    const allTasks = Object.values(boardTasks)

    // Basic statistics
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((task) => task.completed).length
    const blockedTasks = allTasks.filter(
      (task) => task.blocked || task.labels.includes('#EB5A46'),
    ).length
    const inProgressTasks = allTasks.filter(
      (task) =>
        !task.completed &&
        !task.blocked &&
        boardColumns
          .find((col) =>
            col.title.toLowerCase().includes('progress') ||
            col.title.toLowerCase().includes('progreso')
          )
          ?.taskIds.includes(task.id),
    ).length

    // Statistics by priority
    const tasksByPriority = {
      high: allTasks.filter((task) => task.priority === 'high').length,
      medium: allTasks.filter((task) => task.priority === 'medium').length,
      low: allTasks.filter((task) => task.priority === 'low').length,
    }

    // Statistics by member
    const tasksByMember = {}
    allTasks.forEach((task) => {
      task.assignedMembers.forEach((memberId) => {
        if (!tasksByMember[memberId]) {
          tasksByMember[memberId] = {
            total: 0,
            completed: 0,
            inProgress: 0,
            blocked: 0,
          }
        }
        tasksByMember[memberId].total++

        if (task.completed) {
          tasksByMember[memberId].completed++
        } else if (task.blocked) {
          tasksByMember[memberId].blocked++
        } else if (
          boardColumns
            .find((col) => col.title.toLowerCase().includes('progress'))
            ?.taskIds.includes(task.id)
        ) {
          tasksByMember[memberId].inProgress++
        }
      })
    })

    // Statistics by column
    const columnStats = await Promise.all(
      boardColumns.map(async (col) => {
        const columnTasks = await taskService.getTasksForColumn(boardId, col)
        const completedTasks = columnTasks.filter((t) => t.completed)
        const blockedTasks = columnTasks.filter((t) => t.blocked || t.labels.includes('#EB5A46'))

        const tasksByPriority = {
          high: columnTasks.filter((t) => t.priority === 'high').length,
          medium: columnTasks.filter((t) => t.priority === 'medium').length,
          low: columnTasks.filter((t) => t.priority === 'low').length,
        }

        const memberStats = {}
        columnTasks.forEach((task) => {
          task.assignedMembers.forEach((memberId) => {
            if (!memberStats[memberId]) {
              memberStats[memberId] = { count: 0, completed: 0, blocked: 0 }
            }
            memberStats[memberId].count++
            if (task.completed) memberStats[memberId].completed++
            if (task.blocked) memberStats[memberId].blocked++
          })
        })

        // Calculate average time in column (in hours)
        const averageTimeInColumn = columnTasks.length
          ? columnTasks.reduce((sum, t) => {
              const timeInColumn = (new Date() - new Date(t.updatedAt)) / (1000 * 60 * 60)
              return sum + timeInColumn
            }, 0) / columnTasks.length
          : 0

        return {
          id: col.id,
          name: col.title,
          stats: {
            totalTasks: columnTasks.length,
            completedTasks: completedTasks.length,
            blockedTasks: blockedTasks.length,
            tasksByPriority,
            memberStats,
            estimatedPoints: columnTasks.reduce((sum, t) => sum + (t.timeEstimation || 0), 0),
            completedPoints: completedTasks.reduce((sum, t) => sum + (t.timeEstimation || 0), 0),
            averageTaskTime: completedTasks.length
              ? completedTasks.reduce((sum, t) => sum + (t.timeEstimation || 0), 0) /
                completedTasks.length
              : 0,
            averageTimeInColumn,
            oldestTask: columnTasks.length
              ? Math.min(...columnTasks.map((t) => new Date(t.createdAt).getTime()))
              : null,
            newestTask: columnTasks.length
              ? Math.max(...columnTasks.map((t) => new Date(t.createdAt).getTime()))
              : null,
          },
        }
      }),
    )

    // Time statistics
    const timeStats = {
      totalEstimated: allTasks.reduce((sum, t) => sum + (t.timeEstimation || 0), 0),
      totalCompleted: allTasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + (t.timeEstimation || 0), 0),
      averageTaskTime: completedTasks
        ? allTasks.filter((t) => t.completed).reduce((sum, t) => sum + (t.timeEstimation || 0), 0) /
          completedTasks
        : 0,
    }

    // Activity statistics
    const today = new Date()
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentActivity = {
      newTasks: allTasks.filter((t) => new Date(t.createdAt) > last7Days).length,
      completedTasks: allTasks.filter((t) => t.completedAt && new Date(t.completedAt) > last7Days)
        .length,
      comments: allTasks.reduce((sum, t) => sum + (t.comments?.length || 0), 0),
    }

    return {
      totalTasks,
      completedTasks,
      blockedTasks,
      inProgressTasks,
      tasksByPriority,
      tasksByMember,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      columnStats,
      timeStats,
      recentActivity,
    }
  },

  /**
   * Calcula métricas de velocidad del equipo basadas en tareas completadas
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Object>} Métricas de velocidad
   * @property {Array<Object>} weeklyProgress - Progreso semanal de tareas completadas
   * @property {number} averageVelocity - Velocidad promedio del equipo
   * @property {number} totalCompletedPoints - Total de puntos completados
   * @throws {Error} Si el tablero no existe
   */
  async calculateVelocityMetrics(boardId) {
    await delay(300)
    const boardColumns = columns[boardId] || []
    const completedTasks =
      boardColumns
        .find((col) => col.title.toLowerCase() === 'completed')
        ?.taskIds.map((taskId) => tasks[boardId][taskId])
        .filter(Boolean) || []

    // Group completed tasks by week
    const tasksByWeek = {}
    completedTasks.forEach((task) => {
      const date = new Date(task.updatedAt)
      const weekKey = `${date.getFullYear()}-${Math.floor(date.getDate() / 7)}`
      if (!tasksByWeek[weekKey]) {
        tasksByWeek[weekKey] = {
          count: 0,
          points: 0,
          week: date.toISOString().split('T')[0],
        }
      }
      tasksByWeek[weekKey].count++
      tasksByWeek[weekKey].points += task.timeEstimation || 0
    })

    // Calculate average velocity
    const weeks = Object.values(tasksByWeek)
    const averageVelocity = weeks.length
      ? weeks.reduce((acc, week) => acc + week.points, 0) / weeks.length
      : 0

    return {
      weeklyProgress: Object.values(tasksByWeek),
      averageVelocity,
      totalCompletedPoints: weeks.reduce((acc, week) => acc + week.points, 0),
    }
  },

  /**
   * Genera una línea de tiempo de eventos en el tablero
   * @async
   * @param {string|number} boardId - ID del tablero
   * @returns {Promise<Array<Object>>} Lista de eventos ordenados por fecha
   * @property {Date} date - Fecha del evento
   * @property {string} type - Tipo de evento ('creation', 'comment', 'update')
   * @property {string} taskId - ID de la tarea relacionada
   * @property {string} taskTitle - Título de la tarea
   * @property {string} [userId] - ID del usuario (solo para comentarios)
   * @throws {Error} Si el tablero no existe
   */
  async getBoardTimeline(boardId) {
    await delay(300)
    const boardTasks = tasks[boardId] || {}
    const allTasks = Object.values(boardTasks)

    // Collect all relevant events
    const events = []

    allTasks.forEach((task) => {
      // Creation event
      events.push({
        date: new Date(task.createdAt),
        type: 'creation',
        taskId: task.id,
        taskTitle: task.title,
      })

      // Comment events
      task.comments?.forEach((comment) => {
        events.push({
          date: new Date(comment.createdAt),
          type: 'comment',
          taskId: task.id,
          taskTitle: task.title,
          userId: comment.author,
        })
      })

      // Update events
      if (task.updatedAt !== task.createdAt) {
        events.push({
          date: new Date(task.updatedAt),
          type: 'update',
          taskId: task.id,
          taskTitle: task.title,
        })
      }
    })

    // Sort events by date
    return events.sort((a, b) => b.date - a.date)
  },
}
