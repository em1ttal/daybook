<!-- 
  EfficiencyMetricsCard.vue
  Componente que muestra las métricas de eficiencia del tablero.
  Visualiza el tiempo promedio por tarea, tasa de eficiencia y tasa de bloqueo,
  incluyendo una barra de progreso visual que indica el nivel de eficiencia general.
-->

<template>
  <div class="stat-card" role="region" aria-label="Métricas de eficiencia del tablero" lang="es">
    <h3 id="efficiency-title">Métricas de Eficiencia</h3>
    <!-- Grid de métricas principales -->
    <div class="efficiency-stats" role="group" aria-labelledby="efficiency-title">
      <div
        class="stat-item"
        role="status"
        aria-atomic="true"
        :aria-label="`Tiempo promedio por tarea: ${Math.round(stats.timeStats?.averageTaskTime || 0)} horas`"
      >
        <span class="stat-value">{{ Math.round(stats.timeStats?.averageTaskTime || 0) }}</span>
        <span class="stat-label"> Horas / Tarea</span>
      </div>
      <div
        class="stat-item"
        role="status"
        aria-atomic="true"
        :aria-label="`Tasa de eficiencia: ${efficiencyRate}%`"
      >
        <span class="stat-value">{{ efficiencyRate }}%</span>
        <span class="stat-label"> Tasa de Eficiencia</span>
      </div>
      <div
        class="stat-item"
        role="status"
        aria-atomic="true"
        :aria-label="`Tasa de bloqueo: ${blockedRate}%`"
      >
        <span class="stat-value">{{ blockedRate }}%</span>
        <span class="stat-label"> Tasa de Bloqueo</span>
      </div>
    </div>

    <!-- Barra de progreso visual de eficiencia -->
    <div class="efficiency-chart" role="group" aria-label="Gráfico de eficiencia">
      <div
        class="chart-bar"
        role="progressbar"
        :aria-valuenow="efficiencyRate"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuetext="`Nivel de eficiencia: ${efficiencyRate}%. ${getEfficiencyDescription}`"
      >
        <!-- Markers every 10% (excluding 0%) -->
        <div
          v-for="n in 10"
          :key="n"
          class="chart-marker"
          :style="{ left: `${n * 10}%` }"
          aria-hidden="true"
        ></div>
        <div
          class="chart-fill"
          :style="{ width: `${efficiencyRate}%` }"
          :class="getEfficiencyClass"
          role="presentation"
          aria-hidden="true"
        ></div>
      </div>
      <!-- Descripción de eficiencia para lectores de pantalla -->
      <div class="visually-hidden" role="status" aria-live="polite">
        {{ getEfficiencyDescription }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props del componente
const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
})

/**
 * Calcula la tasa de eficiencia basada en el tiempo estimado vs completado
 * @returns {number} Porcentaje de eficiencia (0-100)
 */
const efficiencyRate = computed(() => {
  if (!props.stats.timeStats?.totalEstimated) return 0
  return Math.round(
    (props.stats.timeStats.totalCompleted / props.stats.timeStats.totalEstimated) * 100,
  )
})

/**
 * Calcula la tasa de tareas bloqueadas
 * @returns {number} Porcentaje de tareas bloqueadas (0-100)
 */
const blockedRate = computed(() => {
  if (!props.stats.totalTasks) return 0
  return Math.round((props.stats.blockedTasks / props.stats.totalTasks) * 100)
})

/**
 * Determina la clase CSS para el color de la barra de eficiencia
 * @returns {string} Clase CSS ('high', 'medium', o 'low')
 */
const getEfficiencyClass = computed(() => {
  if (efficiencyRate.value > 75) return 'high' // Verde para alta eficiencia
  if (efficiencyRate.value > 50) return 'medium' // Amarillo para eficiencia media
  return 'low' // Rojo para baja eficiencia
})

/**
 * Genera una descripción textual del nivel de eficiencia
 */
const getEfficiencyDescription = computed(() => {
  if (efficiencyRate.value > 75) {
    return 'El equipo está mostrando una alta eficiencia en la completación de tareas'
  }
  if (efficiencyRate.value > 50) {
    return 'El equipo mantiene un nivel medio de eficiencia'
  }
  return 'El equipo muestra una eficiencia por debajo de lo esperado'
})
</script>

<!-- 
  Estilos del componente
  - Grid responsivo para las métricas
  - Barra de progreso con colores según nivel de eficiencia
  - Diseño limpio y minimalista para fácil lectura
-->
<style scoped>
.efficiency-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.efficiency-chart {
  margin-top: 2rem;
}

/* Barra de progreso base */
.chart-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

/* Relleno de la barra con transición suave */
.chart-fill {
  height: 100%;
  transition: width 0.3s ease;
}

/* Colores según nivel de eficiencia */
.chart-fill.high {
  background: #61bd4f; /* Verde para alta eficiencia */
}
.chart-fill.medium {
  background: #f2d600; /* Amarillo para eficiencia media */
}
.chart-fill.low {
  background: #eb5a46; /* Rojo para baja eficiencia */
}

/* Clase para elementos visualmente ocultos pero accesibles para lectores de pantalla */
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

/* Mejoras de accesibilidad visual */
.stat-item:focus-within {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Tooltip accesible */
.chart-bar:hover::after {
  content: attr(aria-valuetext);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
}

/* Markers every 10% */
.chart-marker {
  position: absolute;
  top: -4px;
  width: 2px;
  height: 16px;
  background: rgba(255, 255, 255, 0.25);
  z-index: 1;
  pointer-events: none;
}
</style>
