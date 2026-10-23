<!-- 
  MemberPerformance.vue
  Componente que muestra el rendimiento individual de cada miembro del tablero.
  Incluye métricas de tareas completadas, en progreso y bloqueadas por miembro.
-->

<template>
  <div
    class="section-container"
    role="region"
    aria-label="Rendimiento de miembros del equipo"
    lang="es"
  >
    <h3 id="member-performance-title">Rendimiento por Miembro</h3>
    <!-- Lista de miembros con sus estadísticas -->
    <div class="member-stats" role="list" aria-labelledby="member-performance-title">
      <div
        v-for="(stats, memberId) in memberStats"
        :key="memberId"
        class="member-row"
        role="listitem"
        :aria-label="`Estadísticas de ${getMemberName(memberId)}`"
        tabindex="0"
      >
        <!-- Información básica del miembro -->
        <div
          class="member-info"
          role="group"
          :aria-label="`Información de ${getMemberName(memberId)}`"
        >
          <img
            :src="getMemberAvatar(memberId)"
            :alt="getMemberName(memberId)"
            :aria-label="`Avatar de ${getMemberName(memberId)}`"
            role="img"
          />
          <div class="member-details">
            <span class="member-name" role="heading" aria-level="4">{{
              getMemberName(memberId)
            }}</span>
            <span class="member-role" role="note" :aria-label="`Rol: ${getMemberRole(memberId)}`">
              {{ getMemberRole(memberId) }}
            </span>
          </div>
        </div>

        <!-- Métricas numéricas del miembro -->
        <div
          class="member-metrics"
          role="group"
          :aria-label="`Métricas de ${getMemberName(memberId)}`"
        >
          <div
            class="metric-item"
            role="status"
            aria-atomic="true"
            aria-live="polite"
            :aria-label="`${stats.completed} tareas completadas`"
          >
            <span class="metric-value completed">{{ stats.completed }}</span>
            <span class="metric-label">Completadas</span>
          </div>
          <div
            class="metric-item"
            role="status"
            aria-atomic="true"
            aria-live="polite"
            :aria-label="`${stats.inProgress} tareas en progreso`"
          >
            <span class="metric-value in-progress">{{ stats.inProgress }}</span>
            <span class="metric-label">En Progreso</span>
          </div>
          <div
            class="metric-item"
            role="status"
            aria-atomic="true"
            aria-live="polite"
            :aria-label="`${stats.blocked} tareas bloqueadas`"
          >
            <span class="metric-value blocked">{{ stats.blocked }}</span>
            <span class="metric-label">Bloqueadas</span>
          </div>
        </div>

        <!-- Barra de progreso visual -->
        <div
          class="member-progress"
          role="progressbar"
          :aria-label="`Progreso de tareas de ${getMemberName(memberId)}`"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="calculateProgress(stats)"
          :aria-valuetext="`${calculateProgress(stats)}% completado`"
        >
          <div class="progress-bar">
            <!-- Segmentos de la barra de progreso -->
            <div
              class="progress-fill completed"
              :style="{ width: `${(stats.completed / stats.total) * 100}%` }"
              role="presentation"
              aria-hidden="true"
            ></div>
            <div
              class="progress-fill in-progress"
              :style="{ width: `${(stats.inProgress / stats.total) * 100}%` }"
              role="presentation"
              aria-hidden="true"
            ></div>
            <div
              class="progress-fill blocked"
              :style="{ width: `${(stats.blocked / stats.total) * 100}%` }"
              role="presentation"
              aria-hidden="true"
            ></div>
            <div
              class="progress-fill pending"
              :style="{
                width: `${((stats.total - stats.completed - stats.inProgress - stats.blocked) / stats.total) * 100}%`,
              }"
              role="presentation"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props del componente
defineProps({
  memberStats: {
    type: Object,
    required: true,
  },
})

/**
 * Obtiene la URL del avatar del miembro
 * @param {string} memberId - ID del miembro
 * @returns {string} URL del avatar
 */
const getMemberAvatar = (memberId) => {
  return `https://ui-avatars.com/api/?name=${getMemberName(memberId)}&background=random`
}

/**
 * Obtiene el nombre del miembro (simulado para demo)
 * @param {string} memberId - ID del miembro
 * @returns {string} Nombre del miembro
 */
const getMemberName = (memberId) => {
  const mockNames = {
    'user-1': 'Ana García',
    'user-2': 'Carlos López',
    'user-3': 'María Rodríguez',
    'user-4': 'David Martínez',
    'user-5': 'Elena Sánchez',
  }
  return mockNames[memberId] || `Usuario ${memberId}`
}

/**
 * Obtiene el rol del miembro (simulado para demo)
 * @param {string} memberId - ID del miembro
 * @returns {string} Rol del miembro
 */
const getMemberRole = (memberId) => {
  const mockRoles = {
    'user-1': 'Product Manager',
    'user-2': 'Frontend Developer',
    'user-3': 'Backend Developer',
    'user-4': 'UI/UX Designer',
    'user-5': 'QA Engineer',
  }
  return mockRoles[memberId] || 'Team Member'
}

/**
 * Calcula el porcentaje total de progreso
 * @param {Object} stats - Estadísticas del miembro
 * @returns {number} Porcentaje de progreso
 */
const calculateProgress = (stats) => {
  return Math.round((stats.completed / stats.total) * 100)
}
</script>

<!-- 
  Estilos del componente
  - Layout para la lista de miembros
  - Estilos para las métricas y barras de progreso
  - Diseño responsivo para diferentes tamaños de pantalla
-->
<style scoped>
.member-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Fila de información de miembro */
.member-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Información básica del miembro */
.member-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 150px;
}

.member-info img {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.member-details {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 500;
}

.member-role {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Métricas numéricas */
.member-metrics {
  display: flex;
  gap: 1.5rem;
  margin-right: 2rem;
}

/* Barra de progreso */
.member-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Estilos de la barra de progreso */
.member-progress .progress-bar {
  flex: 1;
  height: 0.5rem;
  background: transparent;
  border-radius: 0.25rem;
  overflow: hidden;
  display: flex;
}

.member-progress .progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

/* Colores de los estados de las tareas */
.member-progress .progress-fill.completed {
  background: #61bd4f;
}

.member-progress .progress-fill.in-progress {
  background: #0079bf;
}

.member-progress .progress-fill.blocked {
  background: #eb5a46;
}

.member-progress .progress-fill.pending {
  background: rgba(255, 255, 255, 0.1);
}
</style>
