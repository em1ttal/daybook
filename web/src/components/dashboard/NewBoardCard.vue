<!-- 
  NewBoardCard.vue
  Componente que representa una tarjeta para crear un nuevo tablero.
  Muestra un botón grande y claro con un icono + y texto descriptivo.
-->

<template>
  <div
    class="board-card new-board"
    @click="$emit('click')"
    role="button"
    tabindex="0"
    @keyup.enter="$emit('click')"
    @keyup.space="$emit('click')"
    aria-label="Crear nuevo tablero"
  >
    <div class="new-board-content">
      <span class="plus-icon" aria-hidden="true">+</span>
      <p>Crear Nuevo Tablero</p>
    </div>
  </div>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.board-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  height: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-board {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.new-board:hover,
.new-board:focus {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.new-board:focus-visible {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
}

.new-board-content {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.plus-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}
</style>
