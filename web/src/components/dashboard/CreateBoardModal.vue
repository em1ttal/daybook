<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2>Crear Nuevo Tablero</h2>
      <form @submit.prevent="handleSubmit" class="create-board-form">
        <div class="form-group">
          <label for="title">Nombre del Tablero</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="Ej: Proyecto Website"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Describe el propósito del tablero"
            rows="3"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="secondary-btn" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="primary-btn">Crear Tablero</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  title: '',
  description: '',
  backgroundColor: '#1a1a2e',
})

const emit = defineEmits(['close', 'create'])

const handleSubmit = () => {
  emit('create', { ...formData.value })
  formData.value = {
    title: '',
    description: '',
  }
}
</script>

<style scoped>
h2 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
}

.create-board-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group input,
.form-group textarea {
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4263eb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.secondary-btn,
.primary-btn {
  border-radius: 0.5rem;
  font-size: 1rem;
}
</style>
