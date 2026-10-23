<!-- 
  TaskCard.vue
  Componente que representa una tarjeta de tarea individual en el tablero Kanban.
  Muestra información resumida de la tarea incluyendo título, descripción, etiquetas,
  prioridad, fecha límite, miembros asignados y progreso de las subtareas.
  Soporta funcionalidad de arrastrar y soltar para mover tareas entre columnas.
-->

<template>
  <div
    class="task-card"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @dragend="$emit('dragend', $event)"
    @click.stop="$emit('click')"
    role="article"
    :aria-label="'Tarea: ' + task.title"
    tabindex="0"
  >
    <!-- Botón de eliminar -->
    <button
      class="delete-task-btn"
      @click.stop="$emit('delete')"
      title="Eliminar tarea"
      aria-label="Eliminar tarea"
    >
      ×
    </button>

    <!-- Indicador de prioridad -->
    <div
      class="task-priority"
      :class="task.priority"
      :aria-label="'Prioridad: ' + task.priority"
    ></div>
    <div
      class="task-labels"
      v-if="task.labels && task.labels.length"
      aria-label="Etiquetas de la tarea"
    >
      <div
        v-for="label in task.labels"
        :key="label"
        class="task-label"
        :style="{ backgroundColor: label }"
        :aria-label="'Etiqueta: ' + label"
      ></div>
    </div>
    <h4>{{ task.title }}</h4>
    <p>{{ task.description }}</p>
    <div class="task-meta">
      <div class="task-info">
        <span
          v-if="task.dueDate"
          class="task-date"
          :class="{ overdue: isOverdue(task.dueDate) }"
          :aria-label="'Fecha límite: ' + formatDate(task.dueDate)"
        >
          {{ formatDate(task.dueDate) }}
        </span>
        <span
          v-if="task.timeEstimation"
          class="task-time"
          :aria-label="'Tiempo estimado: ' + task.timeEstimation + ' horas'"
        >
          {{ task.timeEstimation }}h
        </span>
      </div>
      <div class="task-members" aria-label="Miembros asignados">
        <div
          v-for="memberId in task.assignedMembers"
          :key="memberId"
          class="member-avatar small"
          :aria-label="'Miembro asignado: ' + getMemberName(memberId)"
        >
          <img :src="getMemberAvatar(memberId)" :alt="getMemberName(memberId)" />
        </div>
      </div>
    </div>
    <div v-if="showProgressBar" class="task-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: calculateProgress + '%' }"></div>
      </div>
      <span class="progress-text">{{ calculateProgress }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { userService } from '../../services/userService'

// Props del componente
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  labelNames: {
    type: Object,
    default: () => ({}),
  },
})

// Eventos emitidos por el componente
defineEmits(['dragstart', 'dragend', 'click', 'delete'])

// Estado para almacenar los miembros del tablero
const boardMembers = ref([])

// Cargar datos de usuarios al montar el componente
onMounted(async () => {
  try {
    boardMembers.value = await userService.getUsers()
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
})

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

/**
 * Verifica si una fecha está vencida
 * @param {string|Date} date - Fecha a verificar
 * @returns {boolean} True si la fecha está vencida
 */
const isOverdue = (date) => {
  return new Date(date) < new Date()
}

/**
 * Obtiene la URL del avatar de un miembro
 * @param {string} memberId - ID del miembro
 * @returns {string} URL del avatar
 */
const getMemberAvatar = (memberId) => {
  const member = boardMembers.value.find((m) => m.id === memberId)
  return (
    member?.avatar ||
    `https://ui-avatars.com/api/?name=${getMemberName(memberId)}&background=random`
  )
}

/**
 * Obtiene el nombre de un miembro
 * @param {string} memberId - ID del miembro
 * @returns {string} Nombre del miembro
 */
const getMemberName = (memberId) => {
  const member = boardMembers.value.find((m) => m.id === memberId)
  return member?.name || `Usuario ${memberId}`
}

/**
 * Verifica si la tarea tiene listas de verificación
 */
const hasChecklist = computed(() => {
  return props.task.checklist && props.task.checklist.items && props.task.checklist.items.length > 0
})

/**
 * Calcula el porcentaje de progreso de las subtareas
 * @returns {number} Porcentaje de progreso (0-100)
 */
const calculateProgress = computed(() => {
  if (!props.task.checklist || !props.task.checklist.items || props.task.checklist.items.length === 0) return 0
  const totalItems = props.task.checklist.items.length
  const completedItems = props.task.checklist.items.filter((item) => item.completed).length
  return Math.round((completedItems / totalItems) * 100)
})

const showProgressBar = computed(() => {
  return props.task.checklist && Array.isArray(props.task.checklist.items) && props.task.checklist.items.length > 0;
});
</script>

<style scoped>
/* Contenedor principal de la tarjeta */
.task-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: grab;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  user-select: none;
}

/* Efectos de hover y active */
.task-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
  transform: scale(0.95);
}

/* Indicador de prioridad */
.task-priority {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

/* Colores de prioridad */
.task-priority.high {
  background: #ff4757; /* Rojo para prioridad alta */
}
.task-priority.medium {
  background: #ffa502; /* Naranja para prioridad media */
}
.task-priority.low {
  background: #2ed573; /* Verde para prioridad baja */
}

/* Estilos del contenido de la tarjeta */
.task-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.task-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilos de las etiquetas */
.task-labels {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.task-label {
  height: 8px;
  width: 32px;
  border-radius: 4px;
}

/* Metadatos de la tarea */
.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.task-date.overdue {
  color: #ff4757; /* Rojo para fechas vencidas */
}

/* Estilos de los avatares de miembros */
.task-members {
  display: flex;
  gap: -0.5rem;
}

.task-members .member-avatar.small:not(:first-child) {
  margin-left: -0.5rem;
}

.member-avatar.small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease;
}

.member-avatar.small:hover {
  transform: scale(1.1);
  z-index: 1;
}

.member-avatar.small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Barra de progreso */
.task-progress {
  margin-top: 0.5rem;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #61bd4f; /* Verde para indicar progreso */
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
}

/* Botón de eliminar tarea */
.delete-task-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  z-index: 1;
  transition: all 0.2s ease;
}

.delete-task-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ff4757;
}
</style>
