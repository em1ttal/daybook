<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="user-info">
        <h1>Bienvenido, {{ userName }}!</h1>
        <p class="board-count">
          Tienes {{ totalBoards }} {{ totalBoards === 1 ? 'tablero activo' : 'tableros activos' }}
        </p>
      </div>
      <button class="logout-button" @click="$emit('logout')">
        <img src="/src/assets/logout-512.webp" alt="Logout" class="logout-icon" />
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  userName: {
    type: String,
    required: true,
  },
  totalBoards: {
    type: Number,
    required: true,
  },
})

defineEmits(['logout'])
</script>

<style scoped>
.dashboard-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.board-count {
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.logout-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.logout-button i {
  font-size: 1.1rem;
}

.logout-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1); /* Makes the icon white */
}
</style>
