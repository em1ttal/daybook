<!-- 
  FeaturesSection.vue
  Componente que muestra la sección de características principales de la aplicación.
  Presenta un grid de tarjetas con las funcionalidades más destacadas.
-->

<template>
  <section id="features" class="features" role="region" aria-labelledby="features-title">
    <h2 id="features-title" class="section-title">Características Principales</h2>
    <div class="feature-grid" role="list" aria-label="Lista de características principales">
      <FeatureCard
        v-for="(feature, index) in features"
        :key="index"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        role="listitem"
      />
    </div>
  </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    icon: '🤖',
    title: 'IA Integrada',
    description:
      'Optimiza tu flujo de trabajo con sugerencias inteligentes y automatización de tareas',
  },
  {
    icon: '🔄',
    title: 'Flujo Kanban',
    description: 'Visualiza y gestiona tu trabajo con tableros Kanban personalizables',
  },
  {
    icon: '👥',
    title: 'Colaboración en Tiempo Real',
    description: 'Trabaja con tu equipo en tiempo real con actualizaciones instantáneas',
  },
  {
    icon: '📊',
    title: 'Análisis Avanzado',
    description: 'Obtén insights valiosos sobre el rendimiento de tu equipo',
  },
]
</script>

<style scoped>
.features {
  padding: 8rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 4rem;
  color: #1a1a2e;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 90%;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Mejoras de accesibilidad visual */
@media (prefers-reduced-motion: reduce) {
  .feature-grid {
    gap: 3rem; /* Aumentar espacio para mejor legibilidad */
  }
}

/* Asegurar contraste suficiente */
.section-title {
  color: #0a0a1f; /* Color más oscuro para mejor contraste */
}
</style>
