<!-- 
  FeatureCard.vue
  Componente que representa una tarjeta individual de característica.
  Muestra un icono, título y descripción de una funcionalidad específica.
-->

<template>
  <div class="feature-card" :aria-label="`Característica: ${title}`">
    <div class="feature-icon" role="img" :aria-label="`Icono de ${title}`">
      {{ icon }}
    </div>
    <h3 :id="`feature-${title.toLowerCase().replace(/\s+/g, '-')}`">{{ title }}</h3>
    <p :aria-labelledby="`feature-${title.toLowerCase().replace(/\s+/g, '-')}`">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.feature-card {
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;
  background: white;
}

@media (prefers-reduced-motion: reduce) {
  .feature-card {
    transition: none;
  }

  .feature-card:hover {
    transform: none;
  }
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-card:focus-within {
  outline: 2px solid #4263eb;
  outline-offset: 2px;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #0a0a1f; /* Mejorado para contraste */
}

.feature-card p {
  color: #444; /* Mejorado para contraste */
  line-height: 1.6;
}

/* Mejoras de accesibilidad visual */
@media (prefers-contrast: more) {
  .feature-card {
    border: 2px solid #0a0a1f;
  }

  .feature-card h3 {
    color: #000;
  }

  .feature-card p {
    color: #222;
  }
}
</style>
