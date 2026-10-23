<template>
  <header class="hero">
    <div class="hero-content">
      <h1 class="animate-title">KanbanIA</h1>
      <p class="tagline animate-fade-in">
        Gestión de tareas colaborativa potenciada por Inteligencia Artificial
      </p>
      <div class="cta-buttons animate-fade-in">
        <button class="primary-btn" @click="handleStart" aria-label="Comenzar ahora con KanbanIA">
          Comenzar Ahora
        </button>
        <button class="secondary-btn" aria-label="Ver demostración de KanbanIA">Ver Demo</button>
      </div>
    </div>
    <div class="hero-background" aria-hidden="true">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
    </div>
    <div
      class="scroll-down"
      role="button"
      aria-label="Desplazarse hacia abajo para más información"
    >
      <a href="#features" class="scroll-link" tabindex="0">
        <span class="scroll-text">Más Información</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-arrow-down"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </a>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'

const router = useRouter()

const handleStart = () => {
  if (authService.isAuthenticated()) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.hero-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.sphere-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, rgba(66, 99, 235, 0.3), rgba(87, 209, 235, 0.3));
  top: 10%;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.sphere-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, rgba(235, 66, 198, 0.3), rgba(235, 87, 87, 0.3));
  bottom: 10%;
  right: -50px;
  animation: float 6s ease-in-out infinite reverse;
}

.hero-content {
  z-index: 2;
  text-align: center;
  margin: 0 auto;
}

.animate-title {
  font-size: 5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #4263eb, #57d1eb);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: slideDown 0.8s ease-out;
}

.tagline {
  font-size: 1.75rem;
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 0.3s;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 0.6s;
}

.scroll-down {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  animation: fadeIn 1s ease-out forwards;
  z-index: 3;
  pointer-events: auto;
}

.scroll-text {
  margin-bottom: 5px;
  display: block;
  animation: bounce 2.5s infinite;
}

.scroll-down svg {
  width: 16px;
  height: 16px;
  animation: none;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes arrowBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

.scroll-link {
  color: white;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.scroll-link:hover, .scroll-link:focus {
  color: white;
  text-decoration: underline;
  outline: none;
  background-color: transparent;
}

/* Ensure smooth scroll for anchor links */
:global(html) {
  scroll-behavior: smooth;
}
</style>
