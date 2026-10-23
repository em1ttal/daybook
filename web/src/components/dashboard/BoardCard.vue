<template>
  <div
    class="board-card"
    @click="navigateToBoard"
    role="button"
    :aria-label="'Ir al tablero ' + board.title"
    tabindex="0"
    @keydown.enter="navigateToBoard"
  >
    <div class="board-card-content">
      <h3>{{ board.title }}</h3>
      <p class="board-description">{{ board.description }}</p>
      <div class="board-meta">
        <span class="board-date" aria-label="Última actividad"
          >Última actividad: {{ formatDate(board.lastActivity) }}</span
        >
        <div class="board-members" aria-label="Miembros del tablero">
          <div
            v-for="member in members"
            :key="member.id"
            class="member-avatar"
            :aria-label="'Miembro: ' + member.name"
            :title="member.name"
          >
            <img :src="member.avatar" :alt="member.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  board: {
    type: Object,
    required: true,
  },
  members: {
    type: Array,
    required: true,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['delete'])

const navigateToBoard = () => {
  router.push(`/board/${props.board.id}`)
}

const formatDate = (date) => {
  if (!date) return 'No hay actividad'
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.board-card {
  position: relative;
  height: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.board-card-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.board-card:hover .board-card-content {
  transform: translateY(-5px);
}

.board-card h3 {
  font-size: 1.4rem;
}

.board-description {
  color: rgba(255, 255, 255, 0.7);
  flex-grow: 1;
  font-size: 0.9rem;
  line-height: 1.4;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.board-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: auto;
}

.board-members {
  display: flex;
}

.member-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.member-avatar:hover {
  transform: translateY(-2px);
  z-index: 1;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
