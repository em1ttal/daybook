<!-- 
  ChecklistSection.vue
  Componente que gestiona las listas de verificación (checklists) de una tarea.
  Permite crear, editar y eliminar listas de verificación y sus elementos,
  con soporte para generación automática de subtareas mediante IA.
-->

<template>
  <div class="form-group" role="region" aria-label="Lista de verificación">
    <div class="section-header">
      <label id="subtasks-label">Subtareas</label>
      <button
        type="button"
        class="action-button"
        @click="generateSubtasks"
        :disabled="!taskId"
        :title="generateSubtasksTooltip"
        aria-label="Generar subtareas con IA"
        :aria-disabled="!taskId"
      >
        <span class="icon" aria-hidden="true">✨</span>
        Generar con IA
      </button>
    </div>

    <div class="checklist" v-if="checklist">
      <div class="checklist-header">
        <input
          v-model="editableTitle"
          @blur="updateTitle"
          class="styled-input"
          :aria-label="'Título de la lista de verificación'"
        />
      </div>

      <div class="checklist-progress">
        <div
          class="progress-bar"
          role="progressbar"
          :aria-valuenow="calculateChecklistProgress(checklist)"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Progreso de ${checklist.title}`"
        >
          <div
            class="progress-fill"
            :style="{ width: calculateChecklistProgress(checklist) + '%' }"
            aria-hidden="true"
          ></div>
        </div>
        <span class="progress-text" aria-live="polite">
          {{ calculateChecklistProgress(checklist) }}%
        </span>
      </div>

      <div class="checklist-items" role="list" :aria-labelledby="'subtasks-label'">
        <div
          v-for="item in checklist.items"
          :key="item.id"
          class="checklist-item"
          role="listitem"
        >
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="item.completed"
              @change="toggleChecklistItem(item.id)"
              :aria-label="`Marcar como ${item.completed ? 'incompleta' : 'completa'} la tarea: ${item.text}`"
            />
            <span :class="{ completed: item.completed }">{{ item.text }}</span>
          </label>
          <button
            type="button"
            class="icon-button"
            @click="deleteChecklistItem(item.id)"
            :aria-label="`Eliminar tarea: ${item.text}`"
          >
            <span aria-hidden="true">x</span>
          </button>
        </div>
      </div>

      <div class="add-item-form" role="form" aria-label="Añadir nueva tarea">
        <input
          type="text"
          v-model="newItemText"
          placeholder="Añadir un elemento..."
          class="styled-input"
          @keyup.enter="addChecklistItem"
          :aria-label="`Añadir tarea a ${checklist.title}`"
        />
        <button
          type="button"
          class="action-button"
          @click="addChecklistItem"
          :disabled="!newItemText"
          :aria-disabled="!newItemText"
          aria-label="Añadir tarea"
        >
          Añadir
        </button>
      </div>
    </div>
    <div v-else class="no-checklist">
      No hay checklist para esta tarea.
      <button
        type="button"
        class="action-button"
        @click="createChecklist"
        :disabled="!taskId"
        :title="createChecklistTooltip"
        :aria-disabled="!taskId"
        style="margin-top: 1rem;"
      >
        Crear checklist
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { aiService } from '../../services/aiService'
import { checklistService } from '../../services/checklistService'

const route = useRoute()

const props = defineProps({
  taskId: {
    type: String,
    default: '',
  },
  checklist: {
    type: Object,
    default: null,
  },
  taskTitle: String,
  taskDescription: String,
})

const emit = defineEmits(['update:checklist'])

const newItemText = ref('')
const editableTitle = computed({
  get: () => props.checklist ? props.checklist.title : '',
  set: (val) => {
    if (props.checklist && props.checklist.title !== val) {
      updateTitle(val)
    }
  }
})

const calculateChecklistProgress = (checklist) => {
  if (!checklist.items || checklist.items.length === 0) return 0
  const completedItems = checklist.items.filter((item) => item.completed).length
  return Math.round((completedItems / checklist.items.length) * 100)
}

const addChecklistItem = async () => {
  if (!newItemText.value.trim()) return
  try {
    const boardId = parseInt(route.params.id)
    await checklistService.addItem(boardId, props.taskId, newItemText.value.trim())
    const updated = await checklistService.getChecklist(boardId, props.taskId)
    emit('update:checklist', updated)
    newItemText.value = ''
  } catch (error) {
    console.error('Error al añadir elemento:', error)
  }
}

const toggleChecklistItem = async (itemId) => {
  try {
    const boardId = parseInt(route.params.id)
    await checklistService.toggleItem(boardId, props.taskId, itemId)
    const updated = await checklistService.getChecklist(boardId, props.taskId)
    emit('update:checklist', updated)
  } catch (error) {
    console.error('Error al actualizar item:', error)
  }
}

const deleteChecklistItem = async (itemId) => {
  try {
    const boardId = parseInt(route.params.id)
    await checklistService.deleteItem(boardId, props.taskId, itemId)
    const updated = await checklistService.getChecklist(boardId, props.taskId)
    emit('update:checklist', updated)
  } catch (error) {
    console.error('Error al eliminar item:', error)
  }
}

const updateTitle = async (newTitle) => {
  try {
    const boardId = parseInt(route.params.id)
    await checklistService.updateTitle(boardId, props.taskId, newTitle)
    const updated = await checklistService.getChecklist(boardId, props.taskId)
    emit('update:checklist', updated)
  } catch (error) {
    console.error('Error al actualizar título:', error)
  }
}

const generateSubtasks = async () => {
  if (!props.taskTitle || !props.taskDescription) return
  try {
    const subtasks = await aiService.generateSubtasks({
      title: props.taskTitle,
      description: props.taskDescription,
    })
    const boardId = parseInt(route.params.id)
    await checklistService.setItems(boardId, props.taskId, subtasks)
    const updated = await checklistService.getChecklist(boardId, props.taskId)
    emit('update:checklist', updated)
  } catch (error) {
    console.error('Error al generar subtareas:', error)
  }
}

const generateSubtasksTooltip = computed(() => {
  return props.taskId ? 'Generar con IA' : 'Primero crea la tarea'
})

const createChecklistTooltip = computed(() => {
  return props.taskId ? 'Crear checklist' : 'Primero crea la tarea'
})

const createChecklist = async () => {
  try {
    const boardId = parseInt(route.params.id)
    await checklistService.createChecklist(boardId, props.taskId)
    const updated = await checklistService.getChecklist(boardId, props.taskId)
    emit('update:checklist', updated)
  } catch (error) {
    console.error('Error al crear checklist:', error)
  }
}
</script>

<!-- 
  Estilos del componente
  - Diseño de listas con scroll vertical
  - Barras de progreso animadas
  - Estilos para elementos interactivos
-->
<style scoped>
/* Contenedor principal de la checklist */
.checklist {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
.checklist::-webkit-scrollbar {
  width: 6px;
}
.checklist::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}
.checklist::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Cabecera de lista */
.checklist-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Barra de progreso */
.checklist-progress {
  margin-bottom: 1rem;
}
.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #61bd4f; /* Verde para progreso */
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
}

/* Lista de elementos */
.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Elemento individual */
.checklist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Estilo del checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.checkbox-label input[type='checkbox'] {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}
.checkbox-label span.completed {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.5);
}

/* Formulario para añadir elementos */
.add-item-form {
  display: flex;
  gap: 0.5rem;
}

/* Botón de acción principal */
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
.action-button.secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Botón de icono */
.icon-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.2rem;
  font-size: 1.2rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.icon-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Input estilizado */
.styled-input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

/* Cabecera de sección */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.section-header label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.no-checklist {
  color: rgba(255,255,255,0.5);
  text-align: center;
  padding: 2rem 0;
}
</style>
