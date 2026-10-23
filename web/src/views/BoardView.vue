<!-- 
  BoardView.vue
  Este componente representa la vista principal de un tablero Kanban.
  Permite la gestión de columnas, tareas, miembros y estadísticas del tablero.
-->

<template>
  <div class="board-view">
    <!-- Cabecera del tablero con información básica y acciones principales -->
    <header class="board-header">
      <div class="header-content">
        <div class="board-info">
          <h1>{{ board.title }}</h1>
          <p>{{ board.description }}</p>
        </div>
        <!-- Acciones principales del tablero: gestión de miembros, estadísticas y nueva tarea -->
        <div class="board-actions">
          <div class="board-members">
            <div
              v-for="member in boardMembers"
              :key="member.id"
              class="member-avatar"
              :title="member.name"
            >
              <img :src="member.avatar" :alt="member.name" />
            </div>
            <button class="add-member-btn" @click="showMemberModal = true" title="Añadir Miembro">
              +
            </button>
          </div>
          <button class="secondary-btn" @click="toggleStats">
            {{ showStats ? 'Tablero' : 'Estadísticas' }}
          </button>
          <button class="primary-btn" @click="openNewTaskModal(-1)">Nueva Tarea</button>
          <button class="secondary-btn" @click="$router.push('/dashboard')">Dashboard</button>
        </div>
      </div>
    </header>

    <main class="board-content">
      <!-- Componente de estadísticas (visible cuando showStats es true) -->
      <BoardStats v-if="showStats" :board-id="parseInt(route.params.id)" />

      <!-- Tablero Kanban (visible cuando showStats es false) -->
      <div v-else class="kanban-board">
        <!-- Columnas del tablero con soporte para drag and drop -->
        <div
          v-for="column in columns"
          :key="column.id"
          class="kanban-column"
          draggable="true"
          @dragstart="startDraggingColumn($event, column)"
          @dragend="stopDraggingColumn"
          @dragover.prevent="onDragOver($event)"
          @dragleave="onDragLeave($event)"
          @drop="onDrop($event, column)"
        >
          <div class="column-header">
            <div class="drag-handle" title="Mover Columna">⋮⋮</div>
            <h3>{{ column.title }}</h3>
            <div class="column-actions">
              <span class="task-count">{{ column.tasks.length }}</span>
              <button
                class="icon-btn"
                @click="deleteColumn(column.id)"
                v-if="columns.length > 1"
                title="Eliminar Columna"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Lista de tareas dentro de cada columna -->
          <div class="task-list" :key="column.tasks.map(t => t.id + '-' + (t.labels ? t.labels.join(',') : '') + '-' + (t.assignedMembers ? t.assignedMembers.join(',') : '')).join('|')">
            <TaskCard
              v-for="task in column.tasks"
              :key="task.id"
              :task="task"
              :labelNames="labelColors"
              @dragstart="startDragging($event, task, column)"
              @dragend="stopDragging"
              @click="openTaskDetails(task)"
              @delete="deleteTask(task.id, column.id)"
            />

            <!-- Botón para añadir nueva tarea en la columna -->
            <button class="add-task-btn" @click="openNewTaskModal(column.id)">
              + Añadir Tarea
            </button>
          </div>
        </div>

        <!-- Botón para añadir nueva columna -->
        <div class="add-column">
          <button class="add-column-btn" @click="showNewColumnModal = true">
            + Añadir Columna
          </button>
        </div>
      </div>
    </main>

    <!-- Modales del tablero -->
    <!-- Modal para crear/editar tarea -->
    <TaskModal
      v-model="showNewTaskModal"
      :task-id="editingTask?.id"
      :column-id="selectedColumn"
      :initial-data="taskForm"
      @save="saveTask"
      @update:modelValue="(val) => !val && closeTaskModal()"
      @update-checklist="onChecklistChanged"
    />

    <!-- Modal para crear nueva columna -->
    <div v-if="showNewColumnModal" class="modal-overlay" @click="showNewColumnModal = false">
      <div class="modal-content" @click.stop>
        <h2>Nueva Columna</h2>
        <form @submit.prevent="createColumn" class="column-form">
          <div class="form-group">
            <input
              v-model="newColumnTitle"
              type="text"
              placeholder="Título de la columna"
              required
            />
          </div>
          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="showNewColumnModal = false">
              Cancelar
            </button>
            <button type="submit" class="primary-btn">Crear columna</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para añadir miembros al tablero -->
    <div v-if="showMemberModal" class="modal-overlay" @click="showMemberModal = false">
      <div class="modal-content" @click.stop>
        <h2>Añadir Miembros</h2>
        <div class="available-members">
          <div
            v-for="user in sortedAvailableUsers"
            :key="user.id"
            class="member-item"
            :class="{ added: isMember(user.id), 'not-added': !isMember(user.id) }"
            @click="!isMember(user.id) && addMember(user.id)"
          >
            <img :src="user.avatar" :alt="user.name" />
            <span>{{ user.name }}</span>
            <span
              v-if="isMember(user.id)"
              class="remove-member-btn"
              @click.stop="removeMember(user.id)"
              title="Eliminar del tablero"
            > x </span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="secondary-btn" @click="showMemberModal = false">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal de error: no hay columnas -->
    <div v-if="showNoColumnsModal" class="modal-overlay" @click="showNoColumnsModal = false">
      <div class="modal-content small" @click.stop>
        <h2>¡No hay columnas!</h2>
        <p>Por favor, crea una columna antes de añadir una tarea.</p>
        <div class="modal-actions">
          <button class="primary-btn" @click="showNoColumnsModal = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { boardService } from '../services/boardService'
import { userService } from '../services/userService'
import { taskService } from '../services/taskService'
import { labelService } from '../services/labelService'
import { columnService } from '../services/columnService'
import TaskCard from '../components/board/TaskCard.vue'
import TaskModal from '../components/board/TaskModal.vue'
import BoardStats from '../components/board/stats/BoardStats.vue'

// Hooks de Vue Router
const route = useRoute()
const router = useRouter()

// Estado del tablero
const board = ref({
  name: 'Cargando...',
  description: '',
})

// Estados para control de modales
const showNewTaskModal = ref(false)
const showNewColumnModal = ref(false)
const showMemberModal = ref(false)
const showNoColumnsModal =ref(false)
const selectedColumn = ref(null)
const editingTask = ref(null)
const newColumnTitle = ref('')

// Formulario de tarea con valores por defecto
const defaultTaskForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  assignedMembers: [],
  labels: [],
  timeEstimation: 0,
  checklists: [],
  comments: [],
}

const taskForm = ref({ ...defaultTaskForm })

// Estados del tablero
const columns = ref([])
const boardMembers = ref([])
const availableUsers = ref([])
const labelColors = ref([])

// Estados para el drag and drop de columnas
const draggedColumnId = ref(null)
const draggedOverColumnId = ref(null)

// Estado para mostrar/ocultar estadísticas
const showStats = ref(false)

const sortedAvailableUsers = computed(() => {
  return [...availableUsers.value].sort((a, b) => {
    const aIsMember = isMember(a.id)
    const bIsMember = isMember(b.id)
    if (aIsMember === bIsMember) return 0
    return aIsMember ? -1 : 1
  })
})

// Hook de ciclo de vida - Carga inicial de datos
onMounted(async () => {
  try {
    const boardId = parseInt(route.params.id)

    // Carga inicial de datos básicos del tablero
    const boardData = await boardService.getBoardDetails(boardId)
    board.value = boardData
    columns.value = await columnService.getColumns(boardId)

    // Carga paralela de datos adicionales
    const [allUsers, labels, members] = await Promise.all([
      userService.getUsers(),
      labelService.getLabels(boardId),
      userService.getBoardMembers(boardId),
    ])

    availableUsers.value = allUsers
    labelColors.value = labels
    boardMembers.value = members
  } catch (error) {
    console.error('Error al cargar el tablero:', error)
    router.push('/dashboard')
  }
})

// Funciones de gestión de tareas
const closeTaskModal = () => {
  showNewTaskModal.value = false
  editingTask.value = null
  taskForm.value = { ...defaultTaskForm }
  selectedColumn.value = null
}

const openTaskDetails = (task) => {
  taskForm.value = {
    ...defaultTaskForm,
    ...task,
    assignedMembers: task.assignedMembers ? [...task.assignedMembers] : [],
    labels: task.labels ? [...task.labels] : [],
  }
  selectedColumn.value = columns.value.find((col) => col.tasks.some((t) => t.id === task.id))?.id
  editingTask.value = task
  showNewTaskModal.value = true
}

const openNewTaskModal = (columnId) => {
  if (!columns.value.length) {
    showNoColumnsModal.value = true
    return
  }
  if (columnId === -1) {
    columnId = columns.value[0].id
  }
  taskForm.value = {
    ...defaultTaskForm,
    assignedMembers: [],
    labels: [],
  }
  selectedColumn.value = columnId
  editingTask.value = null
  showNewTaskModal.value = true
}

/**
 * Elimina una tarea del tablero
 * @param {string} taskId - ID de la tarea a eliminar
 * @param {string} columnId - ID de la columna que contiene la tarea
 */
const deleteTask = async (taskId, columnId) => {
  try {
    const boardId = parseInt(route.params.id)
    await taskService.deleteTask(boardId, taskId, columnId)

    // Actualizar el estado local
    const column = columns.value.find((col) => col.id === columnId)
    if (column) {
      column.tasks = column.tasks.filter((task) => task.id !== taskId)
    }
  } catch (error) {
    console.error('Error al eliminar la tarea:', error)
  }
}

// Funciones de gestión de columnas
const createColumn = async () => {
  if (!newColumnTitle.value.trim()) return

  try {
    const newColumn = await columnService.createColumn(
      board.value.id, 
      newColumnTitle.value.trim()
    )

    columns.value.push(newColumn)
    newColumnTitle.value = ''
    showNewColumnModal.value = false
  } catch (error) {
    console.error('Error al crear columna:', error)
  }
}

const deleteColumn = async (columnId) => {
  try {
    await columnService.deleteColumn(columnId)
    columns.value = columns.value.filter((col) => col.id !== columnId)
  } catch (error) {
    console.error('Error al eliminar columna:', error)
  }
}

// Funciones para guardar tareas
const saveTask = async (taskData) => {
  const boardId = parseInt(route.params.id)
  try {
    if (editingTask.value) {
      // Actualización de tarea existente
      const updatedTask = await taskService.updateTask(boardId, editingTask.value.id, taskData)
      // Actualizar estado local
      for (const column of columns.value) {
        const idx = column.tasks.findIndex((t) => t.id === editingTask.value.id)
        if (idx !== -1) {
          column.tasks = [
            ...column.tasks.slice(0, idx),
            updatedTask,
            ...column.tasks.slice(idx + 1)
          ]
          break
        }
      }
    } else {
      // Creación de nueva tarea
      const newTask = await taskService.createTask(boardId, selectedColumn.value, taskData)
      const column = columns.value.find((col) => col.id === selectedColumn.value)
      if (column) {
        column.tasks.push(newTask)
      }
    }
    closeTaskModal()
  } catch (error) {
    console.error('Error al guardar la tarea:', error)
  }
}

// Funciones de gestión de miembros
const addMember = async (userId) => {
  try {
    const boardId = parseInt(route.params.id)
    await userService.addBoardMember(boardId, userId)
    boardMembers.value = await userService.getBoardMembers(boardId)
  } catch (error) {
    console.error('Error al añadir miembro:', error)
  }
}

const removeMember = async (userId) => {
  try {
    const boardId = parseInt(route.params.id)
    await userService.removeBoardMember(boardId, userId)
    boardMembers.value = await userService.getBoardMembers(boardId)
  } catch (error) {
    console.error('Error al eliminar miembro:', error)
  }
}

// Funciones de drag and drop para tareas
const startDragging = (event, task, sourceColumn) => {
  event.stopPropagation()
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData(
    'application/json',
    JSON.stringify({
      type: 'task',
      taskId: task.id,
      sourceColumnId: sourceColumn.id,
    }),
  )
}

const stopDragging = () => {
  document.querySelectorAll('.kanban-column').forEach((column) => {
    column.classList.remove('drag-over')
  })
}

// Funciones de drag and drop para columnas
const startDraggingColumn = (event, column) => {
  event.stopPropagation()
  draggedColumnId.value = column.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData(
    'application/json',
    JSON.stringify({
      type: 'column',
      columnId: column.id,
    }),
  )
}

const stopDraggingColumn = () => {
  draggedColumnId.value = null
  draggedOverColumnId.value = null
  document.querySelectorAll('.kanban-column').forEach((column) => {
    column.classList.remove('drag-over')
  })
}

// Funciones auxiliares para drag and drop
const onDragOver = (event) => {
  event.preventDefault()
  const column = event.currentTarget
  column.classList.add('drag-over')
}

const onDragLeave = (event) => {
  event.currentTarget.classList.remove('drag-over')
}

// Función principal de manejo de drop
const onDrop = async (event, targetColumn) => {
  event.preventDefault()
  event.currentTarget.classList.remove('drag-over')

  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))

    // Manejo de drop para columnas
    if (data.type === 'column') {
      const sourceColumnId = data.columnId
      if (sourceColumnId === targetColumn.id) return

      const boardId = parseInt(route.params.id)

      const sourceIndex = columns.value.findIndex((col) => col.id === sourceColumnId)
      const targetIndex = columns.value.findIndex((col) => col.id === targetColumn.id)

      if (sourceIndex !== -1 && targetIndex !== -1) {
        const [movedColumn] = columns.value.splice(sourceIndex, 1)
        columns.value.splice(targetIndex, 0, movedColumn)

        await columnService.updateBoardColumns(boardId, columns.value)
      }
      return
    }

    // Manejo de drop para tareas
    const { taskId, sourceColumnId } = data
    if (sourceColumnId === targetColumn.id) return

    const boardId = parseInt(route.params.id)
    await taskService.moveTask(boardId, taskId, sourceColumnId, targetColumn.id)

    const sourceColumn = columns.value.find((col) => col.id === sourceColumnId)
    if (!sourceColumn) return

    const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) return

    const [task] = sourceColumn.tasks.splice(taskIndex, 1)
    targetColumn.tasks.push(task)
  } catch (error) {
    console.error('Error al mover:', error)
  }
}

// Función para alternar vista de estadísticas
const toggleStats = () => {
  showStats.value = !showStats.value
}

const isMember = (userId) => boardMembers.value.some(member => member.id === userId)

const onChecklistChanged = ({ id, checklist }) => {
  for (const column of columns.value) {
    const taskIndex = column.tasks.findIndex((t) => t.id === id)
    if (taskIndex !== -1) {
      column.tasks[taskIndex] = {
        ...column.tasks[taskIndex],
        checklist
      }
      break
    }
  }
}
</script>

<style scoped>
.board-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.board-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-info h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.board-info p {
  color: rgba(255, 255, 255, 0.7);
}

.board-actions {
  display: flex;
  gap: 1rem;
}

.board-content {
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
  min-height: calc(100vh - 200px);
  overflow: auto;

  /* Mantener los estilos del scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    height: 8px;
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    margin: 0 2rem;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.kanban-board {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  min-height: calc(100vh - 200px);
  width: 100%;
}

.kanban-column {
  flex: 1;
  min-width: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  cursor: grab;
}

.drag-handle {
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.2rem;
  cursor: grab;
  padding: 0.2rem 0.5rem;
  user-select: none;
}

.drag-handle:hover {
  color: rgba(255, 255, 255, 0.6);
}

.column-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.column-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
}

.icon-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1; /* Hace que la lista ocupe todo el espacio disponible */
  min-height: 50px; /* Altura mínima más pequeña ya que toda la columna es zona de drop */
  padding: 0.5rem;
}

.task-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  user-select: none; /* Previene la selección de texto durante el drag */
}

.task-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
  transform: scale(0.95);
}

/* Efecto visual durante el drag */
.task-card[draggable='true']:active {
  opacity: 0.7;
  cursor: grabbing;
}

.task-priority {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.task-priority.high {
  background: #ff4757;
}
.task-priority.medium {
  background: #ffa502;
}
.task-priority.low {
  background: #2ed573;
}

.task-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.task-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.add-task-btn,
.add-column-btn {
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-task-btn:hover,
.add-column-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.add-column {
  min-width: 300px;
  max-width: 300px;
  display: flex;
  align-items: flex-start;
}

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
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  margin: auto;
  position: relative;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  background: #1a1a2e;
  padding: 1rem 0;
  z-index: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.task-form,
.column-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #4263eb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  position: sticky;
  bottom: 0;
  background: #1a1a2e;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Efecto visual cuando se arrastra sobre una columna */
.kanban-column.drag-over {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

/* Removemos el efecto visual de drag-over de la task-list ya que ahora está en la columna */
.task-list.drag-over {
  background: none;
  border-radius: 0;
}

.board-members {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.member-avatar.small {
  width: 24px;
  height: 24px;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-member-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.task-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.task-date.overdue {
  color: #eb5a46;
}

.task-members {
  display: flex;
  gap: 0.25rem;
}

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
  background: #61bd4f;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
}

.description-group {
  position: relative;
}

.optimize-btn {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
}

.optimize-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.label-options {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
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

.member-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.member-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.member-option.selected {
  background: rgba(255, 255, 255, 0.2);
}

.member-option img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.time-estimation {
  display: flex;
  gap: 0.5rem;
}

.suggest-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
}

.available-members {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.member-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.member-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.styled-select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
}

.styled-select option {
  background: #1a1a2e;
  color: white;
  padding: 0.5rem;
}

.styled-input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

.styled-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  resize: vertical;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
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

.action-button.secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.icon {
  font-size: 1.2rem;
}

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

.checklists {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
  margin: -0.5rem;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}

.checklist {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
}

.checklist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checklist-progress {
  margin-bottom: 1rem;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.checklist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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

.add-item-form {
  display: flex;
  gap: 0.5rem;
}

.add-checklist-btn {
  width: 100%;
  padding: 0.8rem;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-checklist-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.new-checklist-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-buttons {
  display: flex;
  gap: 0.5rem;
}

.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.5rem;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}

.comment {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-author img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.comment-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.comment-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.delete-comment {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.add-comment {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label-manager {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.label-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.label-color {
  width: 32px;
  height: 24px;
  border-radius: 4px;
  flex-shrink: 0;
}

.modal-content.small {
  max-width: 400px;
  max-height: 70vh;
}

.kanban-column.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

/* Ajustar el estilo del botón de estadísticas */
.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.remove-member-btn {
  margin-left: auto;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 0 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.remove-member-btn:hover {
  background: rgba(255, 71, 87, 0.1);
}

.member-item.added {
  background: rgba(46, 213, 115, 0.15); /* greenish for added */
  border: 1px solid #2ed573;
}
.member-item.not-added {
  background: rgba(255, 255, 255, 0.08);
  border: 1px dashed #aaa;
  opacity: 0.7;
}
.member-item.not-added:hover {
  background: rgba(46, 213, 115, 0.08);
  border-color: #2ed573;
  opacity: 1;
}
</style>
