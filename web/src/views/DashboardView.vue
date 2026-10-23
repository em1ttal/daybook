<!-- 
  DashboardView.vue
  Este componente representa la vista principal del dashboard donde se muestran todos los tableros del usuario.
  Permite la gestión de tableros: visualización, creación y eliminación.
-->

<template>
  <div class="dashboard">
    <!-- Cabecera del dashboard con información del usuario y contador de tableros -->
    <DashboardHeader :user-name="user.name" :total-boards="boards.length" @logout="handleLogout" />

    <main class="dashboard-content">
      <!-- Tarjeta para crear nuevo tablero -->
      <NewBoardCard @click="showCreateBoardModal = true" />

      <!-- Lista de tableros existentes -->
      <BoardCard
        v-for="board in boards"
        :key="board.id"
        :board="board"
        :members="boardMembers[board.id] || []"
        :is-owner="board.owner === user.id"
        @delete="deleteBoard"
      />
    </main>

    <!-- Modal para crear nuevo tablero -->
    <CreateBoardModal
      v-if="showCreateBoardModal"
      @close="showCreateBoardModal = false"
      @create="createBoard"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { boardService } from '../services/boardService'
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'
import BoardCard from '../components/dashboard/BoardCard.vue'
import NewBoardCard from '../components/dashboard/NewBoardCard.vue'
import CreateBoardModal from '../components/dashboard/CreateBoardModal.vue'

// Router para navegación
const router = useRouter()

// Estados reactivos
const user = ref({ name: '' }) // Información del usuario actual
const showCreateBoardModal = ref(false) // Control de visibilidad del modal de creación
const boards = ref([]) // Lista de tableros del usuario
const boardMembers = ref({}) // Miembros de cada tablero (objeto con id del tablero como clave)
const isLoading = ref(true) // Estado de carga de la vista

/**
 * Carga los miembros de un tablero específico
 * @param {Object} board - Tablero del cual cargar los miembros
 */
const loadBoardMembers = async (board) => {
  try {
    const members = await boardService.getBoardMembers(board.id)
    boardMembers.value[board.id] = members
  } catch (error) {
    console.error(`Error loading members for board ${board.id}:`, error)
    boardMembers.value[board.id] = []
  }
}

// Hook de ciclo de vida - Carga inicial de datos
onMounted(async () => {
  try {
    // Obtener usuario actual y verificar autenticación
    user.value = authService.getCurrentUser()
    if (!user.value) {
      router.push('/login')
      return
    }

    // Cargar lista de tableros
    boards.value = await boardService.getBoards()

    // Cargar miembros de cada tablero en paralelo
    await Promise.all(boards.value.map(loadBoardMembers))
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})

/**
 * Maneja el proceso de cierre de sesión
 */
const handleLogout = async () => {
  try {
    await authService.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

/**
 * Crea un nuevo tablero
 * @param {Object} boardData - Datos del nuevo tablero
 */
const createBoard = async (boardData) => {
  try {
    const newBoard = await boardService.createBoard(boardData, user.value.id)
    boards.value.push(newBoard)
    boardMembers.value[newBoard.id] = [user.value]
    showCreateBoardModal.value = false
  } catch (error) {
    console.error('Error creating board:', error)
  }
}

/**
 * Elimina un tablero existente
 * @param {number} boardId - ID del tablero a eliminar
 */
const deleteBoard = async (boardId) => {
  try {
    await boardService.deleteBoard(boardId)
    boards.value = boards.value.filter((board) => board.id !== boardId)
    delete boardMembers.value[boardId]
  } catch (error) {
    console.error('Error deleting board:', error)
  }
}
</script>

<!-- 
  Estilos específicos del dashboard
  - Diseño responsivo usando CSS Grid
  - Fondo con gradiente
  - Adaptación para dispositivos móviles
-->
<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.dashboard-content {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Ajustes para dispositivos móviles */
@media (max-width: 768px) {
  .dashboard-content {
    padding: 0 1rem;
    grid-template-columns: 1fr;
  }
}
</style>
