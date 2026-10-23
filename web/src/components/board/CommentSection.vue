<!-- 
  CommentSection.vue
  Componente que gestiona la sección de comentarios de una tarea.
  Permite ver, añadir y eliminar comentarios, mostrando el autor,
  fecha y contenido de cada comentario en un diseño ordenado y responsive.
-->

<template>
  <div class="form-group" role="region" aria-label="Sección de comentarios">
    <div class="section-header">
      <label id="comments-label">Comentarios</label>
    </div>
    <div class="comments-section">
      <!-- Lista de comentarios existentes -->
      <div class="comments-list" role="feed" aria-labelledby="comments-label">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment"
          role="article"
          :aria-label="`Comentario de ${getMemberName(comment.author)}`"
        >
          <!-- Cabecera del comentario con autor y fecha -->
          <div class="comment-header">
            <div class="comment-author" role="group" aria-label="Información del autor">
              <img
                :src="getMemberAvatar(comment.author)"
                :alt="`Avatar de ${getMemberName(comment.author)}`"
                role="img"
              />
              <span>{{ getMemberName(comment.author) }}</span>
            </div>
            <span
              class="comment-date"
              role="time"
              :datetime="comment.createdAt"
              :aria-label="`Publicado el ${formatDate(comment.createdAt)}`"
            >
              {{ formatDate(comment.createdAt) }}
            </span>
          </div>
          <!-- Contenido del comentario -->
          <p class="comment-text" role="contentinfo">{{ comment.text }}</p>
          <!-- Botón para eliminar comentario -->
          <button
            type="button"
            class="icon-button delete-comment"
            @click="deleteComment(comment.id)"
            :aria-label="`Eliminar comentario de ${getMemberName(comment.author)}`"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>

      <!-- Formulario para añadir nuevo comentario -->
      <div class="add-comment" role="form" aria-label="Añadir nuevo comentario">
        <div class="comment-input-wrapper">
          <textarea
            v-model="newComment"
            placeholder="Escribe un comentario..."
            class="styled-textarea"
            rows="2"
            @keyup.enter.prevent="addComment"
            :disabled="!taskId"
            :aria-label="
              !taskId ? 'Guarda la tarea primero para añadir comentarios' : 'Escribe un comentario'
            "
            :aria-disabled="!taskId"
          ></textarea>
          <button
            type="button"
            class="send-button"
            @click="addComment"
            :disabled="!newComment || !taskId"
            :aria-disabled="!newComment || !taskId"
            :aria-label="
              !taskId
                ? 'Guarda la tarea primero para añadir comentarios'
                : !newComment
                  ? 'Escribe un comentario antes de enviar'
                  : 'Enviar comentario'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              role="img"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '../../services/authService'
import { userService } from '../../services/userService'
import { commentService } from '../../services/commentService'

const route = useRoute()

// Props del componente
const props = defineProps({
  taskId: {
    type: String,
    default: '',
  },
  comments: {
    type: Array,
    default: () => [],
  },
})

// Eventos emitidos
const emit = defineEmits(['update:comments'])

// Estado local
const newComment = ref('')
const users = ref([])

/**
 * Carga los datos de usuarios al montar el componente
 */
onMounted(async () => {
  try {
    users.value = await userService.getUsers()
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
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
 * Obtiene la URL del avatar de un miembro
 * @param {string} memberId - ID del miembro
 * @returns {string} URL del avatar
 */
const getMemberAvatar = (memberId) => {
  const user = users.value.find((u) => u.id === memberId)
  return user
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${getMemberName(memberId)}&background=random`
}

/**
 * Obtiene el nombre de un miembro
 * @param {string} memberId - ID del miembro
 * @returns {string} Nombre del miembro
 */
const getMemberName = (memberId) => {
  const user = users.value.find((u) => u.id === memberId)
  return user ? user.name : `Usuario ${memberId}`
}

/**
 * Añade un nuevo comentario a la tarea
 */
const addComment = async () => {
  if (!newComment.value) return

  try {
    const boardId = parseInt(route.params.id)
    const currentUser = authService.getCurrentUser()
    const newCommentObj = await commentService.addComment(
      boardId,
      props.taskId,
      newComment.value,
      currentUser.id,
    )

    // Solo emitir la actualización si el comentario no existe ya
    if (!props.comments.some((c) => c.id === newCommentObj.id)) {
      emit('update:comments', [...props.comments, newCommentObj])
    }
    newComment.value = ''
  } catch (error) {
    console.error('Error al añadir comentario:', error)
  }
}

/**
 * Elimina un comentario de la tarea
 * @param {string} commentId - ID del comentario a eliminar
 */
const deleteComment = async (commentId) => {
  try {
    const boardId = parseInt(route.params.id)
    const updatedComments = props.comments.filter((c) => c.id !== commentId)
    const success = await commentService.deleteComment(boardId, props.taskId, commentId)

    if (success) {
      emit('update:comments', updatedComments)
    }
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
  }
}
</script>

<!-- 
  Estilos del componente
  - Diseño de lista de comentarios con scroll
  - Estilos para comentarios individuales
  - Formulario de nuevo comentario con diseño moderno
-->
<style scoped>
/* Contenedor principal de comentarios */
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Lista scrolleable de comentarios */
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

/* Estilo de comentario individual */
.comment {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;
}

/* Cabecera del comentario */
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Información del autor */
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

/* Fecha del comentario */
.comment-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Texto del comentario */
.comment-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

/* Botón de eliminar comentario */
.delete-comment {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

/* Sección para añadir comentario */
.add-comment {
  position: relative;
}

.comment-input-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
}

/* Textarea para nuevo comentario */
.styled-textarea {
  width: 100%;
  padding: 0.8rem;
  padding-right: 3rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  resize: none;
  transition: all 0.3s ease;
}

.styled-textarea:focus {
  border-color: #4263eb; /* Azul para foco */
  outline: none;
  background: rgba(255, 255, 255, 0.1);
}

/* Botón de enviar comentario */
.send-button {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-button:not(:disabled):hover {
  color: #4263eb; /* Azul para hover */
  background: rgba(66, 99, 235, 0.1);
}

.send-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.send-button svg {
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
}

/* Cabecera de sección */
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

/* Botón de icono genérico */
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
</style>
