<!-- 
  LoginView.vue
  Este componente representa la página de inicio de sesión.
  Incluye un formulario de login con validación y efectos visuales animados.
-->

<template>
  <div class="login-page" role="main" aria-label="Página de inicio de sesión">
    <!-- Contenedor principal del formulario -->
    <div class="login-container">
      <div class="login-content">
        <!-- Título y subtítulo animados -->
        <h1 id="login-title" class="animate-title">Bienvenido</h1>
        <p class="tagline animate-fade-in" id="login-description">Accede a tu espacio de trabajo</p>

        <!-- Formulario de login con validación -->
        <form
          @submit.prevent="handleLogin"
          class="login-form animate-fade-in"
          role="form"
          aria-labelledby="login-title"
          aria-describedby="login-description"
        >
          <!-- Campo de email con manejo de errores -->
          <div class="form-group" :class="{ error: errors.email }">
            <label for="email" class="visually-hidden">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Email"
              required
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'email-error' : undefined"
              autocomplete="email"
            />
            <span v-if="errors.email" id="email-error" class="error-message" role="alert">
              {{ errors.email }}
            </span>
          </div>

          <!-- Campo de contraseña con manejo de errores -->
          <div class="form-group" :class="{ error: errors.password }">
            <label for="password" class="visually-hidden">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Contraseña"
              required
              :aria-invalid="!!errors.password"
              :aria-describedby="errors.password ? 'password-error' : undefined"
              autocomplete="current-password"
            />
            <span v-if="errors.password" id="password-error" class="error-message" role="alert">
              {{ errors.password }}
            </span>
          </div>

          <!-- Botón de submit con estado de carga -->
          <button
            type="submit"
            class="primary-btn"
            :disabled="isLoading"
            :aria-busy="isLoading"
            aria-live="polite"
          >
            {{ isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <!-- Credenciales de demo para pruebas -->
        <p
          class="demo-credentials animate-fade-in"
          role="note"
          aria-label="Credenciales de demostración"
        >
          Demo: demo@example.com / demo123
        </p>
      </div>
    </div>

    <!-- Fondo decorativo con esferas animadas -->
    <div class="login-background" aria-hidden="true">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

// Router para navegación post-login
const router = useRouter()

// Estados reactivos del formulario
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref({})

/**
 * Maneja el proceso de inicio de sesión
 * - Valida y envía las credenciales
 * - Maneja errores de autenticación
 * - Redirige al dashboard en caso de éxito
 */
const handleLogin = async () => {
  errors.value = {}
  isLoading.value = true

  try {
    await authService.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    errors.value.email = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<!-- 
  Estilos específicos de la página de login
  - Diseño centrado con fondo gradiente
  - Efectos visuales y animaciones
  - Estilos de formulario y validación
  - Elementos decorativos animados
-->
<style scoped>
/* Contenedor principal */
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
}

/* Contenedor del formulario */
.login-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 440px;
  padding: 2rem;
}

/* Contenido del formulario con efecto glassmorphism */
.login-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Clase para elementos visualmente ocultos pero accesibles para lectores de pantalla */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Fondo decorativo */
.login-background {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

/* Animaciones y estilos del título */
.animate-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #4263eb, #57d1eb);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: slideDown 0.8s ease-out;
}

/* Estilos del subtítulo */
.tagline {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: white;
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 0.3s;
}

/* Estilos del formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 0.6s;
}

/* Grupos de campos del formulario */
.form-group {
  position: relative;
}

/* Estilos de los inputs */
.form-group input {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

/* Estado focus de los inputs */
.form-group input:focus {
  outline: none;
  border-color: #4263eb;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 2px rgba(66, 99, 235, 0.3);
}

/* Estado de error en los inputs */
.form-group.error input {
  border-color: #ff4757;
}

.form-group.error input:focus {
  box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.3);
}

/* Mensajes de error */
.error-message {
  color: #ff4757;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  text-align: left;
}

/* Credenciales de demo */
.demo-credentials {
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

/* Esferas decorativas del fondo */
.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

/* Primera esfera decorativa */
.sphere-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, rgba(66, 99, 235, 0.3), rgba(87, 209, 235, 0.3));
  top: 10%;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

/* Segunda esfera decorativa */
.sphere-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, rgba(235, 66, 198, 0.3), rgba(235, 87, 87, 0.3));
  bottom: 10%;
  right: -50px;
  animation: float 6s ease-in-out infinite reverse;
}

/* Mejoras de accesibilidad para preferencias de usuario */
@media (prefers-reduced-motion: reduce) {
  .animate-title,
  .animate-fade-in,
  .gradient-sphere {
    animation: none;
  }

  .login-form,
  .tagline {
    opacity: 1;
  }
}

/* Mejoras de contraste para usuarios con problemas de visión */
@media (prefers-contrast: more) {
  .login-content {
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: none;
  }

  .form-group input {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .error-message {
    color: #ff8f8f;
  }

  .demo-credentials {
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
