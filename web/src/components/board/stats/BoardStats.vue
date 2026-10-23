<!-- 
  BoardStats.vue
  Componente principal que agrupa y coordina todas las estadísticas del tablero.
  Gestiona la carga de datos y los distribuye a los componentes hijos.
-->

<template>
  <div class="board-stats" role="main" aria-label="Estadísticas del tablero" lang="es">
    <!-- Cabecera de la sección de estadísticas -->
    <BoardStatsHeader />

    <!-- Grid de tarjetas con métricas principales -->
    <div class="stats-grid" role="group" aria-label="Métricas principales">
      <TaskSummaryCard :stats="stats" />
      <PriorityDistributionCard :stats="stats" />
      <EfficiencyMetricsCard :stats="stats" />
    </div>

    <!-- Componentes de estadísticas detalladas -->
    <div role="region" aria-label="Estadísticas detalladas">
      <ColumnStatistics :column-stats="stats.columnStats" />
      <MemberPerformance :member-stats="memberStats" />
      <TimelineSection :timeline="timeline" />
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" role="alert" aria-live="polite" class="loading-state">
      Cargando estadísticas...
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" role="alert" aria-live="assertive" class="error-state">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { analyticsService } from '../../../services/analyticsService'
import BoardStatsHeader from './BoardStatsHeader.vue'
import TaskSummaryCard from '../TaskSummaryCard.vue'
import PriorityDistributionCard from './PriorityDistributionCard.vue'
import EfficiencyMetricsCard from './EfficiencyMetricsCard.vue'
import ColumnStatistics from './ColumnStatistics.vue'
import MemberPerformance from './MemberPerformance.vue'
import TimelineSection from './TimelineSection.vue'

// Props del componente
const props = defineProps({
  boardId: {
    type: Number,
    required: true,
  },
})

// Estado principal de las estadísticas
const stats = ref({
  totalTasks: 0, // Total de tareas en el tablero
  completedTasks: 0, // Tareas completadas
  blockedTasks: 0, // Tareas bloqueadas
  inProgressTasks: 0, // Tareas en progreso
  tasksByPriority: {}, // Distribución por prioridad
  tasksByMember: {}, // Distribución por miembro
  completionRate: 0, // Tasa de finalización
  columnStats: [], // Estadísticas por columna
})

// Estados de UI
const loading = ref(true)
const error = ref(null)

// Historial de eventos del tablero
const timeline = ref([])

// Estadísticas computadas para los miembros
const memberStats = computed(() => stats.value.tasksByMember || {})

/**
 * Carga todas las estadísticas del tablero
 * Realiza llamadas paralelas para optimizar el tiempo de carga
 */
const loadStats = async () => {
  loading.value = true
  error.value = null

  try {
    const [taskStats, timelineEvents] = await Promise.all([
      analyticsService.calculateTaskStats(props.boardId),
      analyticsService.getBoardTimeline(props.boardId),
    ])

    stats.value = taskStats
    timeline.value = timelineEvents
  } catch (err) {
    error.value = 'Error al cargar las estadísticas. Por favor, intente nuevamente.'
    console.error('Error al cargar estadísticas:', err)
  } finally {
    loading.value = false
  }
}

// Inicialización de datos al montar el componente
onMounted(() => {
  loadStats()
})
</script>

<!-- 
  Estilos del componente
  - Layout flexible para adaptarse a diferentes tamaños de pantalla
  - Grid responsivo para las tarjetas de estadísticas
-->
<style scoped>
.board-stats {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Estados de UI */
.loading-state,
.error-state {
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
}

.loading-state {
  background: rgba(255, 255, 255, 0.1);
}

.error-state {
  background: rgba(235, 87, 87, 0.1);
  color: #eb5757;
}

/* Mejoras de accesibilidad visual */
:focus {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
}

/* Asegurar contraste suficiente */
.error-state {
  color: #ff7070;
}
</style>
