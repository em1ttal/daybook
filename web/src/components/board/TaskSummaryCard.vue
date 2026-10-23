<!-- 
  TaskSummaryCard.vue
  Componente que muestra un resumen general de las tareas del tablero.
  Visualiza métricas clave como el total de tareas, completadas, en progreso y bloqueadas,
  junto con una barra de progreso que indica el porcentaje de completitud general.
-->

<template>
  <div class="stat-card" role="region" aria-labelledby="task-summary-title">
    <h3 id="task-summary-title">Resumen de Tareas</h3>
    <!-- Grid de métricas principales -->
    <div class="stat-numbers" role="group" aria-label="Métricas principales">
      <div class="stat-item" role="status" aria-atomic="true" aria-label="Total de tareas">
        <span class="stat-value">{{ stats.totalTasks }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item" role="status" aria-atomic="true" aria-label="Tareas completadas">
        <span class="stat-value">{{ stats.completedTasks }}</span>
        <span class="stat-label">Completadas</span>
      </div>
      <div class="stat-item" role="status" aria-atomic="true" aria-label="Tareas en progreso">
        <span class="stat-value">{{ stats.inProgressTasks }}</span>
        <span class="stat-label">En Progreso</span>
      </div>
      <div class="stat-item" role="status" aria-atomic="true" aria-label="Tareas bloqueadas">
        <span class="stat-value">{{ stats.blockedTasks }}</span>
        <span class="stat-label">Bloqueadas</span>
      </div>
    </div>
    <!-- Barra de progreso de completitud -->
    <div class="completion-bar">
      <div
        class="completion-fill"
        :style="{ width: `${stats.completionRate}%` }"
        role="progressbar"
        :aria-valuenow="Math.round(stats.completionRate)"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Progreso total del tablero: ${Math.round(stats.completionRate)}%`"
      ></div>
      <span class="completion-text" aria-live="polite">
        {{ Math.round(stats.completionRate) }}% Completado
      </span>
    </div>
  </div>
</template>

<script setup>
// Props del componente
defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<!-- 
  Estilos del componente
  - Grid responsivo para las métricas
  - Barra de progreso con animación suave
  - Diseño limpio y minimalista para fácil lectura
-->
<style scoped>
/* Grid de estadísticas */
.stat-numbers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Estilo de cada métrica */
.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Barra de progreso */
.completion-bar {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  height: 0.5rem;
  position: relative;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

/* Relleno de la barra con transición suave */
.completion-fill {
  background: #61bd4f; /* Verde para indicar progreso */
  height: 100%;
  border-radius: 0.5rem;
  transition: width 0.3s ease;
}

/* Texto de porcentaje de completitud */
.completion-text {
  top: 0.75rem;
  position: absolute;
  right: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>
