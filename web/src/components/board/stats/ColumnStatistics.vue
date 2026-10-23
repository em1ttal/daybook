<!-- 
  ColumnStatistics.vue
  Componente que muestra estadísticas detalladas por columna del tablero.
  Permite seleccionar columnas específicas y visualizar sus métricas individuales.
-->

<template>
  <div
    class="section-container columns-section"
    role="region"
    aria-label="Estadísticas detalladas por columna"
    lang="es"
  >
    <!-- Cabecera con selector de columnas -->
    <div class="section-header">
      <h3 id="column-stats-title">Estadísticas por Columna</h3>
      <div class="column-selector" role="group" aria-label="Selector de columnas para visualizar">
        <button
          v-for="column in columnStats"
          :key="column.id"
          class="column-toggle"
          :class="{ active: selectedColumns.includes(column.id) }"
          @click="toggleColumn(column.id)"
          :aria-pressed="selectedColumns.includes(column.id)"
          :aria-label="`Mostrar estadísticas de columna ${column.name}`"
        >
          {{ column.name }}
        </button>
      </div>
    </div>

    <!-- Grid de tarjetas de estadísticas por columna -->
    <div
      class="column-stats-grid custom-scrollbar"
      role="list"
      aria-labelledby="column-stats-title"
    >
      <div
        v-for="column in selectedColumnStats"
        :key="column.id"
        class="column-stat-card"
        role="listitem"
        :aria-label="`Estadísticas de columna ${column.name}`"
      >
        <!-- Cabecera de la columna con métricas principales -->
        <div class="column-stat-header">
          <h4 :id="`column-${column.id}-title`">{{ column.name }}</h4>
          <div class="column-metrics" role="group" :aria-labelledby="`column-${column.id}-title`">
            <div class="metric" role="status" aria-atomic="true">
              <span class="metric-value">{{ column.stats.totalTasks }}</span>
              <span class="metric-label">Tareas</span>
            </div>
            <div class="metric" role="status" aria-atomic="true">
              <span class="metric-value">{{ column.stats.completedTasks }}</span>
              <span class="metric-label">Completadas</span>
            </div>
            <div class="metric" role="status" aria-atomic="true">
              <span class="metric-value">{{ column.stats.blockedTasks }}</span>
              <span class="metric-label">Bloqueadas</span>
            </div>
          </div>
        </div>

        <!-- Distribución de tareas por prioridad -->
        <div class="priority-distribution">
          <h5 :id="`priority-${column.id}-title`">Distribución por Prioridad</h5>
          <div class="priority-bars" role="group" :aria-labelledby="`priority-${column.id}-title`">
            <div
              class="priority-bar"
              v-for="priority in priorities"
              :key="priority.name"
              role="progressbar"
              :aria-valuemin="0"
              :aria-valuemax="100"
              :aria-valuenow="getColumnPriorityPercentage(column, priority.name)"
              :aria-valuetext="`${priority.label}: ${column.stats.tasksByPriority[priority.name]} tareas, ${Math.round(getColumnPriorityPercentage(column, priority.name))}%`"
            >
              <div
                class="priority-fill"
                :class="priority.name"
                :style="{ width: `${getColumnPriorityPercentage(column, priority.name)}%` }"
                role="presentation"
                aria-hidden="true"
              ></div>
              <span class="priority-label">
                {{ priority.label }} ({{ column.stats.tasksByPriority[priority.name] }})
              </span>
            </div>
          </div>
        </div>

        <!-- Métricas de tiempo -->
        <div class="time-metrics" role="group" aria-label="Métricas de tiempo">
          <div class="metric" role="status" aria-atomic="true">
            <span class="metric-value">{{ column.stats.estimatedPoints }}h</span>
            <span class="metric-label">Tiempo total estimado</span>
          </div>
          <div class="metric" role="status" aria-atomic="true">
            <span class="metric-value">{{ Math.round(column.stats.averageTaskTime) }}h</span>
            <span class="metric-label">Promedio por tarea</span>
          </div>
        </div>

        <!-- Lista de miembros activos en la columna -->
        <div class="column-members">
          <h5 :id="`members-${column.id}-title`">Miembros Activos</h5>
          <div class="member-list" role="list" :aria-labelledby="`members-${column.id}-title`">
            <div
              v-for="(stats, memberId) in column.stats.memberStats"
              :key="memberId"
              class="member-stat"
              role="listitem"
              :aria-label="`${getMemberName(memberId)}: ${stats.count} tareas, ${stats.completed} completadas`"
            >
              <img
                :src="getMemberAvatar(memberId)"
                :alt="`Avatar de ${getMemberName(memberId)}`"
                role="img"
              />
              <div class="member-stat-info">
                <span class="member-name">{{ getMemberName(memberId) }}</span>
                <div class="member-metrics" aria-live="polite">
                  <span>{{ stats.count }} tareas</span>
                  <span class="completed">{{ stats.completed }} completadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { userService } from '@/services/userService'

// Props del componente
const props = defineProps({
  columnStats: {
    type: Array,
    required: true,
  },
})

// Estado para columnas seleccionadas
const selectedColumns = ref([])

// Cache de datos de usuarios
const memberData = ref({})

/**
 * Carga los datos de un miembro y los almacena en cache
 * @param {string} memberId - ID del miembro a cargar
 * @returns {Promise<Object>} Datos del miembro
 */
const loadMemberData = async (memberId) => {
  if (!memberData.value[memberId]) {
    const user = await userService.getUserById(memberId)
    memberData.value[memberId] = user
  }
  return memberData.value[memberId]
}

/**
 * Obtiene el avatar de un miembro desde la cache
 * @param {string} memberId - ID del miembro
 * @returns {string} URL del avatar
 */
const getMemberAvatar = (memberId) => {
  const user = memberData.value[memberId]
  return user?.avatar || `https://ui-avatars.com/api/?name=Loading...&background=random`
}

/**
 * Obtiene el nombre de un miembro desde la cache
 * @param {string} memberId - ID del miembro
 * @returns {string} Nombre del miembro
 */
const getMemberName = (memberId) => {
  let user = memberData.value[memberId]
  if (!user) {
    loadMemberData(memberId)
    return 'Cargando...'
  }
  return user.name
}

// Configuración de prioridades
const priorities = [
  { name: 'high', label: 'Alta' },
  { name: 'medium', label: 'Media' },
  { name: 'low', label: 'Baja' },
]

// Columnas filtradas según selección
const selectedColumnStats = computed(() => {
  return props.columnStats.filter((col) => selectedColumns.value.includes(col.id))
})

/**
 * Alterna la selección de una columna
 * @param {number} columnId - ID de la columna
 */
const toggleColumn = (columnId) => {
  const index = selectedColumns.value.indexOf(columnId)
  if (index === -1) {
    selectedColumns.value.push(columnId)
  } else {
    selectedColumns.value.splice(index, 1)
  }
}

/**
 * Calcula el porcentaje de tareas por prioridad en una columna
 * @param {Object} column - Datos de la columna
 * @param {string} priority - Nombre de la prioridad
 * @returns {number} Porcentaje de tareas
 */
const getColumnPriorityPercentage = (column, priority) => {
  const total = Object.values(column.stats.tasksByPriority).reduce((a, b) => a + b, 0)
  return total ? (column.stats.tasksByPriority[priority] / total) * 100 : 0
}

// Inicialización del componente
onMounted(async () => {
  // Seleccionar todas las columnas inicialmente
  if (props.columnStats?.length > 0) {
    selectedColumns.value = props.columnStats.map((col) => col.id)
  }

  // Precargar datos de usuarios
  for (const column of props.columnStats) {
    const memberIds = Object.keys(column.stats.memberStats)
    for (const memberId of memberIds) {
      await loadMemberData(memberId)
    }
  }
})
</script>

<!-- 
  Estilos del componente
  - Layout para la sección de columnas
  - Estilos para las tarjetas de estadísticas
  - Diseño responsivo y scroll horizontal
-->
<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

/* Selector de columnas */
.column-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.column-toggle {
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.column-toggle.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

/* Grid de tarjetas de columnas */
.column-stats-grid {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  margin: -0.5rem;
}

/* Tarjeta individual de columna */
.column-stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 300px;
  width: 300px;
}

/* Cabecera de la tarjeta */
.column-stat-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Grid de métricas */
.column-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Estilo de métricas individuales */
.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: bold;
}

.metric-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Sección de distribución por prioridad */
.priority-distribution {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.priority-distribution h5 {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.priority-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.priority-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.priority-fill {
  height: 8px;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.priority-fill.high {
  background: #eb5a46;
}
.priority-fill.medium {
  background: #f2d600;
}
.priority-fill.low {
  background: #61bd4f;
}

.priority-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  min-width: 100px;
}

.time-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;
}

.time-metrics .metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.time-metrics .metric-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f2d600;
}

.column-members {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.column-members h5 {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.member-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.member-stat img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.member-stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.member-name {
  font-weight: 500;
}

.member-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.member-metrics .completed {
  color: #61bd4f;
}

/* Mejoras de accesibilidad visual */
.column-toggle:focus {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
}

.column-stat-card:focus-within {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
}

/* Asegurar contraste suficiente */
.metric-label {
  color: rgba(255, 255, 255, 0.8);
}

.priority-label {
  color: rgba(255, 255, 255, 0.9);
}

/* Mejorar la visibilidad del foco */
.member-stat:focus-within {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Asegurar que el scroll es accesible */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar:focus {
  outline: none;
  border: 2px solid #4263eb;
  border-radius: 4px;
}
</style>
