<!-- 
  TimelineSection.vue
  Componente que muestra una línea de tiempo con los eventos del tablero.
  Visualiza la actividad reciente como creación de tareas, comentarios y actualizaciones.
-->

<template>
  <div
    class="section-container"
    role="region"
    aria-label="Línea de tiempo de actividades"
    lang="es"
  >
    <h3 id="timeline-title">Línea de Tiempo</h3>
    <!-- Lista de eventos ordenada cronológicamente -->
    <div
      class="timeline custom-scrollbar"
      role="feed"
      aria-busy="false"
      aria-labelledby="timeline-title"
    >
      <div
        v-for="event in timeline"
        :key="`${event.type}-${event.taskId}-${event.date}`"
        class="timeline-event"
        role="article"
        :aria-label="getEventDescription(event)"
        tabindex="0"
      >
        <!-- Indicador visual del tipo de evento -->
        <div class="event-dot" :class="event.type" role="presentation" aria-hidden="true"></div>
        <!-- Contenido del evento -->
        <div class="event-content">
          <span
            class="event-date"
            role="time"
            :datetime="event.date"
            :aria-label="'Fecha: ' + formatDate(event.date)"
          >
            {{ formatDate(event.date) }}
          </span>
          <p class="event-description" role="contentinfo" :aria-label="getEventDescription(event)">
            {{ getEventDescription(event) }}
          </p>
        </div>
      </div>
      <!-- Mensaje cuando no hay eventos -->
      <div v-if="timeline.length === 0" class="no-events" role="status" aria-live="polite">
        No hay eventos registrados
      </div>
    </div>
  </div>
</template>

<script setup>
// Props del componente
defineProps({
  timeline: {
    type: Array,
    required: true,
  },
})

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada en español
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
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
  }
  return mockNames[memberId] || `Usuario ${memberId}`
}

/**
 * Genera la descripción del evento según su tipo
 * @param {Object} event - Evento a describir
 * @returns {string} Descripción del evento
 */
const getEventDescription = (event) => {
  switch (event.type) {
    case 'creation':
      return `Se creó la tarea "${event.taskTitle}"`
    case 'comment':
      return `${getMemberName(event.userId)} comentó en "${event.taskTitle}"`
    case 'update':
      return `Se actualizó la tarea "${event.taskTitle}"`
    default:
      return `Evento en "${event.taskTitle}"`
  }
}
</script>

<!-- 
  Estilos del componente
  - Layout vertical para la línea de tiempo
  - Diseño de eventos con indicadores visuales
  - Scroll personalizado para la lista de eventos
-->
<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 1rem;
}

/* Estilo de cada evento */
.timeline-event {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* Indicador visual del tipo de evento */
.event-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  margin-top: 0.25rem;
}

/* Colores según tipo de evento */
.event-dot.creation {
  background: #61bd4f;
}
.event-dot.comment {
  background: #0079bf;
}
.event-dot.update {
  background: #f2d600;
}

/* Contenido del evento */
.event-content {
  flex: 1;
}

.event-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.event-description {
  margin-top: 0.25rem;
}

/* Añadimos estilos para focus visible */
.timeline-event:focus {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Estilo para cuando no hay eventos */
.no-events {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Aseguramos que el scroll es accesible */
.timeline.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.timeline.custom-scrollbar:focus {
  outline: none;
  border: 2px solid #4263eb;
  border-radius: 4px;
}
</style>
