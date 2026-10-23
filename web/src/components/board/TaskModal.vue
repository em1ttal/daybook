<template>
  <div v-if="modelValue" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
      </div>
      <div class="modal-body">
        <form id="taskForm" @submit.prevent="saveTask" class="task-form">
          <div class="form-group">
            <label>Título</label>
            <input
              v-model="taskForm.title"
              type="text"
              placeholder="Título de la tarea"
              class="styled-input"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prioridad</label>
              <select v-model="taskForm.priority" class="styled-select">
                <option value="low" class="priority-low">Baja</option>
                <option value="medium" class="priority-medium">Media</option>
                <option value="high" class="priority-high">Alta</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha Límite</label>
              <input type="date" v-model="taskForm.dueDate" class="styled-input" />
            </div>
          </div>

          <div class="form-group">
            <div class="section-header">
              <label>Estimación de Tiempo (Horas)</label>
              <button
                type="button"
                class="action-button"
                @click="estimateTime"
                :disabled="!taskForm.title || !taskForm.description"
                :title="addDisabledTooltip"
              >
                <span class="icon">✨</span>
                Calcular con IA
              </button>
            </div>
            <input
              v-model="taskForm.timeEstimation"
              type="number"
              min="0"
              step="0.5"
              placeholder="Ej: 2.5"
              class="styled-input"
            />
          </div>

          <div class="form-group">
            <div class="section-header">
              <label>Etiquetas</label>
            </div>
            <div class="label-options">
              <div
                v-for="color in labelColors"
                :key="color"
                class="label-option"
                :class="{ selected: taskForm.labels?.includes(color) }"
                :style="{ backgroundColor: color }"
                @click="toggleLabel(color)"
              ></div>
            </div>
          </div>

          <div class="form-group">
            <div class="section-header">
              <label>Descripción</label>
              <button
                type="button"
                class="action-button"
                @click="optimizeDescription"
                :disabled="!taskForm.description"
                :title="addDisabledTooltip"
              >
                <span class="icon">✨</span>
                Optimizar con IA
              </button>
            </div>
            <textarea
              v-model="taskForm.description"
              placeholder="Descripción detallada de la tarea..."
              rows="3"
              class="styled-textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <div class="section-header">
              <label>Miembros Asignados</label>
            </div>
            <div class="member-section">
              <div class="assigned-members">
                <div
                  v-for="memberId in taskForm.assignedMembers"
                  :key="memberId"
                  class="member-item"
                >
                  <div class="member-info">
                    <img :src="getMemberAvatar(memberId)" :alt="getMemberName(memberId)" />
                    <div class="member-details">
                      <span class="member-name">{{ getMemberName(memberId) }}</span>
                      <span class="member-role">{{ getMemberRole(memberId) }}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="icon-button"
                    @click="removeMember(memberId)"
                    title="Eliminar miembro"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div class="member-selector">
                <select v-model="selectedMember" class="styled-select" @change="addMember">
                  <option value="">Añadir miembro...</option>
                  <option v-for="member in availableMembers" :key="member.id" :value="member.id">
                    {{ member.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <ChecklistSection
            :task-id="safeTaskId"
            :checklist="taskForm.checklist"
            :task-title="taskForm.title"
            :task-description="taskForm.description"
            @update:checklist="onChecklistUpdate"
          />

          <CommentSection
            :task-id="safeTaskId"
            :comments="taskForm.comments"
            @update:comments="updateComments"
          />
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="secondary-btn" @click="handleClose">Cancelar</button>
        <button type="submit" form="taskForm" class="primary-btn">
          {{ isEditing ? 'Guardar cambios' : 'Crear tarea' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { aiService } from '../../services/aiService'
import { userService } from '../../services/userService'
import ChecklistSection from './ChecklistSection.vue'
import CommentSection from './CommentSection.vue'

const props = defineProps({
  modelValue: Boolean,
  taskId: String,
  columnId: Number,
  initialData: Object,
})

const emit = defineEmits(['update:modelValue', 'save', 'update-checklist'])

const defaultTaskForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  labels: [],
  checklist: null,
  comments: [],
  timeEstimation: null,
  assignedMembers: [],
}

const taskForm = ref({ ...defaultTaskForm })

const isEditing = computed(() => !!props.taskId)

// Fix safeTaskId to use taskId directly
const safeTaskId = computed(() => {
  console.log('Computing safeTaskId:', {
    taskId: props.taskId,
    isEditing: isEditing.value,
  })
  return props.taskId || ''
})

const labelColors = ref([
  '#61BD4F', // Verde
  '#F2D600', // Amarillo
  '#FF9F1A', // Naranja
  '#EB5A46', // Rojo
  '#C377E0', // Morado
  '#0079BF', // Azul
])

const boardMembers = ref([])
const selectedMember = ref('')

onMounted(async () => {
  try {
    boardMembers.value = await userService.getUsers()
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
})

const availableMembers = computed(() => {
  return boardMembers.value.filter((member) => !taskForm.value.assignedMembers?.includes(member.id))
})

const getMemberAvatar = (memberId) => {
  const member = boardMembers.value.find((m) => m.id === memberId)
  return (
    member?.avatar ||
    `https://ui-avatars.com/api/?name=${getMemberName(memberId)}&background=random`
  )
}

const getMemberName = (memberId) => {
  const member = boardMembers.value.find((m) => m.id === memberId)
  return member?.name || `Usuario ${memberId}`
}

const getMemberRole = (memberId) => {
  const member = boardMembers.value.find((m) => m.id === memberId)
  return member?.role || 'Miembro del equipo'
}

const addMember = () => {
  if (!selectedMember.value) return
  if (!taskForm.value.assignedMembers) {
    taskForm.value.assignedMembers = []
  }
  taskForm.value.assignedMembers.push(selectedMember.value)
  selectedMember.value = ''
}

const removeMember = (memberId) => {
  taskForm.value.assignedMembers = taskForm.value.assignedMembers.filter((id) => id !== memberId)
}

// Reset form when modal visibility changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      // Reset form when modal is closed
      taskForm.value = { ...defaultTaskForm }
    } else {
      // Set form data only if we have initial data
      taskForm.value = props.initialData ? { ...props.initialData } : { ...defaultTaskForm }
    }
  },
  { immediate: true },
)

// Handle modal close
const handleClose = () => {
  taskForm.value = { ...defaultTaskForm }
  emit('update:modelValue', false)
}

const toggleLabel = (color) => {
  if (!taskForm.value.labels) {
    taskForm.value.labels = []
  }
  const index = taskForm.value.labels.indexOf(color)
  if (index === -1) {
    taskForm.value.labels.push(color)
  } else {
    taskForm.value.labels.splice(index, 1)
  }
}

const optimizeDescription = async () => {
  if (!taskForm.value.description) return
  try {
    taskForm.value.description = await aiService.optimizeTaskDescription(taskForm.value.description)
  } catch (error) {
    console.error('Error al optimizar la descripción:', error)
  }
}

const estimateTime = async () => {
  if (!taskForm.value.title || !taskForm.value.description) return
  try {
    taskForm.value.timeEstimation = await aiService.suggestTimeEstimation({
      title: taskForm.value.title,
      description: taskForm.value.description,
    })
  } catch (error) {
    console.error('Error al estimar el tiempo:', error)
  }
}

const updateComments = (newComments) => {
  taskForm.value = {
    ...taskForm.value,
    comments: newComments,
  }
}

const saveTask = async () => {
  emit('save', {
    ...taskForm.value,
    columnId: props.columnId,
  })
}

const onChecklistUpdate = (newChecklist) => {
  // Clone the checklist to ensure reactivity
  taskForm.value = {
    ...taskForm.value,
    checklist: newChecklist ? JSON.parse(JSON.stringify(newChecklist)) : null
  }
  emit('update-checklist', { id: taskForm.value.id, checklist: newChecklist });
};

const addDisabledTooltip = computed(() => {
  return !taskForm.value.title || !taskForm.value.description
    ? 'Primero se necesita un título y una descripción'
    : 'Estimación de IA'
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: #1a1a2e;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  height: 85vh;
  margin: auto;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent content from overflowing */
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.modal-footer {
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: #1a1a2e;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: white;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Ensure form buttons don't conflict with footer */
.task-form .permanent-footer {
  display: none;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.styled-input,
.styled-select,
.styled-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.styled-input:focus,
.styled-select:focus,
.styled-textarea:focus {
  border-color: #4263eb;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
}

.styled-textarea {
  min-height: 100px;
  resize: vertical;
}

.primary-btn,
.secondary-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: #4263eb;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #3b5bdb;
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 1.2rem;
}

.label-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.label-option {
  width: 32px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s ease;
}

.label-option.selected {
  opacity: 1;
  transform: scale(1.1);
}

.styled-select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(30, 30, 45, 1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.styled-select:focus {
  border-color: #4263eb;
  outline: none;
  background-color: rgba(40, 40, 55, 1);
}

.styled-select option {
  background-color: #1a1a2e;
  color: white;
  padding: 1rem;
  font-size: 1rem;
}

/* Estilos específicos para las opciones de prioridad */
.priority-low {
  color: #61bd4f;
}

.priority-medium {
  color: #f2d600;
}

.priority-high {
  color: #eb5a46;
}

/* Estilos específicos para diferentes navegadores */
/* Firefox */
.styled-select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 white;
}

/* Edge */
.styled-select::-ms-value {
  background: transparent;
  color: white;
}

/* Safari y Chrome */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .styled-select {
    padding-right: 2.5rem;
  }
}

/* Hover state */
.styled-select:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Disabled state */
.styled-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.member-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
}

.assigned-members {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.member-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.member-info img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.member-details {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.member-role {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.member-selector {
  margin-top: 0.5rem;
}
</style>
