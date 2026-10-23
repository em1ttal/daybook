<!-- 
  PriorityDistributionCard.vue
  Componente que muestra la distribución de tareas por prioridad.
  Incluye un gráfico circular y una leyenda con los porcentajes.
-->

<template>
  <div class="stat-card" role="region" aria-label="Distribución de tareas por prioridad" lang="es">
    <h3 id="priority-title">Distribución por Prioridad</h3>
    <div class="priority-stats" aria-labelledby="priority-title">
      <!-- Gráfico circular SVG -->
      <div
        class="priority-chart"
        role="img"
        aria-label="Gráfico circular de distribución de prioridades"
        aria-describedby="priority-description"
      >
        <div id="priority-description" class="visually-hidden">
          Representación gráfica de la distribución de tareas por prioridad
        </div>
        <svg viewBox="0 0 100 100" class="pie-chart" aria-hidden="true" role="presentation">
          <!-- Segmentos del gráfico circular -->
          <circle
            v-for="(priority, index) in priorities"
            :key="priority.name"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            :stroke="priority.color"
            stroke-width="10"
            :stroke-dasharray="`${getPriorityPercentage(priority.name) * 3.14} 314`"
            :stroke-dashoffset="getOffset(index)"
            role="presentation"
          />
          <text x="50" y="45" text-anchor="middle" class="chart-center-text" role="presentation">
            {{ stats.totalTasks }}
          </text>
          <text x="50" y="60" text-anchor="middle" class="chart-center-subtext" role="presentation">
            Tareas
          </text>
        </svg>
      </div>

      <!-- Leyenda con detalles por prioridad -->
      <div class="priority-legend" role="list" aria-label="Leyenda de prioridades" tabindex="0">
        <div
          v-for="priority in priorities"
          :key="priority.name"
          class="legend-item"
          role="listitem"
          :aria-label="`Prioridad ${priority.label}: ${stats.tasksByPriority?.[priority.name] || 0} tareas, ${Math.round(getPriorityPercentage(priority.name))}%`"
          tabindex="0"
        >
          <span
            class="color-dot"
            :class="priority.name"
            aria-hidden="true"
            role="presentation"
          ></span>
          <div class="legend-info">
            <span>{{ priority.label }}</span>
            <span
              class="legend-count"
              role="status"
              :aria-label="`${stats.tasksByPriority?.[priority.name] || 0} tareas`"
            >
              {{ stats.tasksByPriority?.[priority.name] || 0 }}
            </span>
            <span
              class="legend-percent"
              role="status"
              :aria-label="`${Math.round(getPriorityPercentage(priority.name))}%`"
            >
              {{ Math.round(getPriorityPercentage(priority.name)) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props del componente
const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
})

// Configuración de prioridades con sus colores
const priorities = [
  { name: 'high', label: 'Alta', color: '#EB5A46' },
  { name: 'medium', label: 'Media', color: '#F2D600' },
  { name: 'low', label: 'Baja', color: '#61BD4F' },
]

/**
 * Calcula el porcentaje de tareas para una prioridad específica
 * @param {string} priority - Nombre de la prioridad
 * @returns {number} Porcentaje de tareas con esa prioridad
 */
const getPriorityPercentage = (priority) => {
  const total = Object.values(props.stats.tasksByPriority || {}).reduce((a, b) => a + b, 0)
  return total ? ((props.stats.tasksByPriority?.[priority] || 0) / total) * 100 : 0
}

/**
 * Calcula el offset para el stroke-dashoffset del SVG
 * Necesario para posicionar correctamente cada segmento del gráfico circular
 * @param {number} index - Índice de la prioridad
 * @returns {number} Valor del offset
 */
const getOffset = (index) => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += getPriorityPercentage(priorities[i].name)
  }
  return -offset * 3.14
}
</script>

<!-- 
  Estilos del componente
  - Layout flexible para gráfico y leyenda
  - Estilos específicos para el gráfico SVG
  - Diseño de la leyenda con indicadores de color
-->
<style scoped>
.priority-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Estilos del gráfico circular */
.priority-chart {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  margin-right: 2rem;
}

.pie-chart {
  transform: rotate(-90deg);
}

/* Estilos del texto central */
.chart-center-text {
  transform: rotate(90deg);
  fill: white;
  font-size: 24px;
  font-weight: bold;
}

.chart-center-subtext {
  transform: rotate(90deg);
  fill: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

/* Estilos de la leyenda */
.priority-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Indicadores de color por prioridad */
.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.color-dot.high {
  background: #eb5a46;
}
.color-dot.medium {
  background: #f2d600;
}
.color-dot.low {
  background: #61bd4f;
}

/* Información de la leyenda */
.legend-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.legend-count {
  font-weight: bold;
}

.legend-percent {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* Clase de utilidad para elementos visualmente ocultos pero accesibles para lectores de pantalla */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
