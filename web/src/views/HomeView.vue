<!-- 
  HomeView.vue
  Este componente representa la página principal/landing page de la aplicación.
  Estructura la página en secciones: hero y características principales.
-->

<template>
  <div class="home">
    <!-- Sección principal con mensaje de bienvenida y CTA -->
    <HeroSection />

    <!-- Sección que muestra las características principales de la aplicación -->
    <FeaturesSection />
  </div>
</template>

<script setup>
// Importación de componentes de sección
import HeroSection from '../components/home/HeroSection.vue'
import FeaturesSection from '../components/home/FeaturesSection.vue'
</script>

<!-- 
  Estilos específicos de la página de inicio
  - Asegura que la página ocupe al menos el alto total de la ventana
-->
<style scoped>
.home {
  min-height: 100vh;
  scroll-behavior: smooth;
}
</style>
