<!-- 
  LabelManager.vue
  Componente modal para gestionar las etiquetas del tablero.
  Permite crear, editar y personalizar etiquetas con diferentes colores
  y nombres para categorizar las tareas del tablero.
-->

<template>
  <div
    v-if="modelValue"
    class="modal-overlay"
    @click="$emit('update:modelValue', false)"
    role="dialog"
    aria-modal="true"
    aria-labelledby="label-manager-title"
  >
    <!-- Modal de gestión de etiquetas -->
    <div class="modal-content small" @click.stop role="document">
      <h2 id="label-manager-title">Gestionar etiquetas</h2>
      <!-- Lista de etiquetas con sus colores y nombres -->
      <div class="label-manager" role="form" aria-label="Editor de etiquetas">
        <div
          v-for="color in labelColors"
          :key="color"
          class="label-item"
          role="group"
          :aria-label="`Editor de etiqueta ${labelNames[color] || 'sin nombre'}`"
        >
          <div
            class="label-color"
            :style="{ backgroundColor: color }"
            role="presentation"
            :aria-label="`Color: ${color}`"
          ></div>
          <input
            type="text"
            v-model="labelNames[color]"
            placeholder="Nombre de la etiqueta"
            class="styled-input"
            :aria-label="`Nombre para etiqueta de color ${color}`"
          />
        </div>
      </div>
      <!-- Acciones del modal -->
      <div class="modal-actions" role="group" aria-label="Acciones del modal">
        <button
          type="button"
          class="secondary-btn"
          @click="$emit('update:modelValue', false)"
          aria-label="Cancelar edición de etiquetas"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="primary-btn"
          @click="saveLabels"
          aria-label="Guardar cambios en etiquetas"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { labelService } from '../../services/labelService'

// Props del componente
const props = defineProps({
  modelValue: Boolean,
  boardId: Number,
})

// Eventos emitidos
const emit = defineEmits(['update:modelValue', 'update:labels'])

/**
 * Colores predefinidos para las etiquetas
 * Incluye una variedad de colores para diferentes categorías
 */
const labelColors = ref([
  '#61BD4F', // Verde
  '#F2D600', // Amarillo
  '#FF9F1A', // Naranja
  '#EB5A46', // Rojo
  '#C377E0', // Morado
  '#0079BF', // Azul
])

// Estado para almacenar los nombres de las etiquetas
const labelNames = ref({})

/**
 * Carga las etiquetas existentes al montar el componente
 */
onMounted(async () => {
  try {
    const labels = await labelService.getLabels(props.boardId)
    labelNames.value = labels
  } catch (error) {
    console.error('Error al cargar etiquetas:', error)
  }
})

/**
 * Guarda los cambios realizados en las etiquetas
 */
const saveLabels = async () => {
  try {
    await labelService.updateLabels(props.boardId, labelNames.value)
    emit('update:labels', labelNames.value)
  } catch (error) {
    console.error('Error al actualizar etiquetas:', error)
  }
}
</script>

<!-- 
  Estilos del componente
  - Modal con fondo semitransparente
  - Diseño de etiquetas con colores personalizables
  - Inputs estilizados para nombres de etiquetas
-->
<style scoped>
/* Overlay del modal */
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

/* Contenedor del modal */
.modal-content.small {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
}

/* Contenedor de etiquetas */
.label-manager {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
}

/* Lista de etiquetas */
.label-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Elemento individual de etiqueta */
.label-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }

  &.selected {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  .label-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .label-name {
    font-size: 0.9rem;
    color: white;
  }
}

/* Sección para nueva etiqueta */
.new-label {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;

  .color-picker {
    position: relative;

    .color-button {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    /* Paleta de colores */
    .color-palette {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 0.5rem;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.3rem;
      z-index: 10;

      .color-option {
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 0.3rem;
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }

  /* Input para nombre de etiqueta */
  input {
    flex: 1;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 0.3rem;
    color: white;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  /* Botón para añadir etiqueta */
  .add-label {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.3rem;
    background: #4caf50; /* Verde para acción positiva */
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #45a049;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

/* Acciones de etiquetas */
.label-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Botones de acción */
.action-button {
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 0.3rem;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  &.delete {
    &:hover {
      background: rgba(255, 0, 0, 0.2); /* Rojo para acción de eliminar */
    }
  }
}
</style>
