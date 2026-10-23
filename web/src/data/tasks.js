/**
 * @module tasks
 * @description Base de datos mock que contiene todas las tareas del sistema organizadas por tableros.
 * Cada tablero contiene un objeto con sus tareas, donde la clave es el ID de la tarea.
 *
 * @typedef {Object} ChecklistItem
 * @property {string} id - ID único del item
 * @property {string} text - Texto del item
 * @property {boolean} completed - Estado de completitud del item
 *
 * @typedef {Object} Checklist
 * @property {string} id - ID único de la checklist
 * @property {string} title - Título de la checklist
 * @property {ChecklistItem[]} items - Items de la checklist
 *
 * @typedef {Object} Comment
 * @property {string} id - ID único del comentario
 * @property {string} text - Texto del comentario
 * @property {string} author - ID del usuario autor
 * @property {string} createdAt - Fecha de creación en formato ISO
 *
 * @typedef {Object} Task
 * @property {string} id - ID único de la tarea
 * @property {string} title - Título de la tarea
 * @property {string} description - Descripción detallada
 * @property {('low'|'medium'|'high')} priority - Prioridad de la tarea
 * @property {string} dueDate - Fecha de vencimiento en formato ISO
 * @property {string[]} assignedMembers - IDs de los miembros asignados
 * @property {string[]} labels - Códigos de color de las etiquetas
 * @property {number} timeEstimation - Estimación de tiempo en horas
 * @property {boolean} completed - Estado de completitud
 * @property {boolean} [blocked] - Indica si la tarea está bloqueada
 * @property {string} [blockReason] - Razón por la que está bloqueada
 * @property {Checklist} checklist - Lista de checklists
 * @property {Comment[]} comments - Lista de comentarios
 * @property {string} createdBy - ID del usuario creador
 * @property {string} createdAt - Fecha de creación en formato ISO
 * @property {string} updatedAt - Fecha de última actualización en formato ISO
 * @property {string} [completedAt] - Fecha de completitud en formato ISO
 */

export const tasks = {
  1: {
    // Backlog tasks
    'task-1': {
      id: 'task-1',
      title: 'Implementar sistema de notificaciones',
      description: 'Crear un sistema de notificaciones en tiempo real para alertas del sistema',
      priority: 'medium',
      dueDate: '2025-05-15',
      assignedMembers: ['user-3'],
      labels: ['#0079BF', '#61BD4F'],
      timeEstimation: 13,
      completed: false,
      checklist: {
        id: 'checklist-1',
        title: 'Funcionalidades requeridas',
        items: [
          { id: 'item-1-1', text: 'Diseñar arquitectura de WebSockets', completed: false },
          { id: 'item-1-2', text: 'Implementar servicio de notificaciones', completed: false },
        ],
      },
      comments: [],
      createdBy: 'user-1',
      createdAt: '2025-03-20T10:00:00Z',
      updatedAt: '2025-03-20T10:00:00Z',
    },
    'task-2': {
      id: 'task-2',
      title: 'Implementación de búsqueda avanzada',
      description: 'Desarrollar sistema de búsqueda con filtros y autocompletado',
      priority: 'high',
      dueDate: '2025-05-20',
      assignedMembers: ['user-2', 'user-3'],
      labels: ['#0079BF'],
      timeEstimation: 21,
      completed: false,
      checklist: {
        id: 'checklist-2',
        title: 'Funcionalidades',
        items: [
          { id: 'item-2-1', text: 'Implementar indexación', completed: false },
          { id: 'item-2-2', text: 'Desarrollar filtros avanzados', completed: false },
          { id: 'item-2-3', text: 'Integrar autocompletado', completed: false },
        ],
      },
      comments: [],
      createdBy: 'user-1',
      createdAt: '2025-03-21T09:00:00Z',
      updatedAt: '2025-03-21T09:00:00Z',
    },

    // In Progress tasks
    'task-3': {
      id: 'task-3',
      title: 'Integración con API de analytics',
      description: 'Conectar con servicios externos de analytics',
      priority: 'medium',
      dueDate: '2025-04-10',
      assignedMembers: ['user-3'],
      labels: ['#0079BF'],
      timeEstimation: 13,
      completed: false,
      checklist: {
        id: 'checklist-3',
        title: 'Tareas',
        items: [
          { id: 'item-3-1', text: 'Configurar API keys', completed: true },
          { id: 'item-3-2', text: 'Implementar tracking events', completed: false },
        ],
      },
      comments: [],
      createdBy: 'user-1',
      createdAt: '2025-03-20T10:00:00Z',
      updatedAt: '2025-03-21T15:00:00Z',
    },

    // Blocked tasks
    'task-4': {
      id: 'task-4',
      title: 'Optimización de rendimiento',
      description: 'Mejorar el rendimiento general de la aplicación',
      priority: 'high',
      dueDate: '2025-04-05',
      assignedMembers: ['user-2'],
      labels: ['#EB5A46', '#F2D600'],
      timeEstimation: 8,
      completed: false,
      blocked: true,
      blockReason: 'Pendiente de análisis de métricas de producción',
      checklist: {
        id: 'checklist-4',
        title: 'Optimizaciones',
        items: [
          { id: 'item-4-1', text: 'Análisis de performance', completed: true },
          { id: 'item-4-2', text: 'Optimizar carga de imágenes', completed: false },
        ],
      },
      comments: [
        {
          id: 'comment-4-1',
          text: 'Bloqueado hasta tener datos completos de métricas en producción',
          author: 'user-2',
          createdAt: '2025-03-21T14:00:00Z',
        },
      ],
      createdBy: 'user-1',
      createdAt: '2025-03-20T09:00:00Z',
      updatedAt: '2025-03-21T14:00:00Z',
    },

    // Sprint 1 tasks (completed)
    'task-5': {
      id: 'task-5',
      title: 'Diseño UI/UX Homepage',
      description: 'Crear el diseño visual de la nueva página principal',
      priority: 'high',
      dueDate: '2025-02-15',
      assignedMembers: ['user-4'],
      labels: ['#61BD4F'],
      timeEstimation: 8,
      completed: true,
      checklist: {
        id: 'checklist-5',
        title: 'Entregables de diseño',
        items: [
          { id: 'item-5-1', text: 'Wireframes', completed: true },
          { id: 'item-5-2', text: 'Mockups en Figma', completed: true },
          { id: 'item-5-3', text: 'Prototipo interactivo', completed: true },
        ],
      },
      comments: [
        {
          id: 'comment-5-1',
          text: 'Diseños aprobados por el cliente',
          author: 'user-1',
          createdAt: '2025-02-15T15:00:00Z',
        },
      ],
      createdBy: 'user-4',
      createdAt: '2025-02-10T09:00:00Z',
      updatedAt: '2025-02-15T15:00:00Z',
      completedAt: '2025-02-15T15:00:00Z',
    },
    'task-6': {
      id: 'task-6',
      title: 'Configuración inicial del proyecto',
      description: 'Setup del proyecto con Next.js y configuración del entorno de desarrollo',
      priority: 'high',
      dueDate: '2025-02-12',
      assignedMembers: ['user-2'],
      labels: ['#61BD4F'],
      timeEstimation: 5,
      completed: true,
      checklist: {
        id: 'checklist-6',
        title: 'Setup',
        items: [
          { id: 'item-6-1', text: 'Inicializar proyecto Next.js', completed: true },
          { id: 'item-6-2', text: 'Configurar ESLint y Prettier', completed: true },
          { id: 'item-6-3', text: 'Configurar CI/CD', completed: true },
        ],
      },
      comments: [
        {
          id: 'comment-6-1',
          text: 'Pipeline de CI configurado y funcionando',
          author: 'user-2',
          createdAt: '2025-02-12T16:00:00Z',
        },
      ],
      createdBy: 'user-2',
      createdAt: '2025-02-11T09:00:00Z',
      updatedAt: '2025-02-12T16:00:00Z',
      completedAt: '2025-02-12T16:00:00Z',
    },
    'task-11': {
      id: 'task-11',
      title: 'Documentación inicial del proyecto',
      description:
        'Crear documentación básica del proyecto incluyendo guías de desarrollo y estándares de código',
      priority: 'low',
      dueDate: '2025-02-14',
      assignedMembers: ['user-2'],
      labels: ['#61BD4F'],
      timeEstimation: 3,
      completed: true,
      checklist: {
        id: 'checklist-11',
        title: 'Documentación requerida',
        items: [
          { id: 'item-11-1', text: 'Guía de instalación', completed: true },
          { id: 'item-11-2', text: 'Estándares de código', completed: true },
          { id: 'item-11-3', text: 'Estructura del proyecto', completed: true },
        ],
      },
      comments: [],
      createdBy: 'user-2',
      createdAt: '2025-02-11T10:00:00Z',
      updatedAt: '2025-02-14T11:00:00Z',
      completedAt: '2025-02-14T11:00:00Z',
    },
    'task-12': {
      id: 'task-12',
      title: 'Configuración de tests unitarios',
      description: 'Configurar Jest y React Testing Library para pruebas unitarias',
      priority: 'medium',
      dueDate: '2025-02-13',
      assignedMembers: ['user-2'],
      labels: ['#61BD4F'],
      timeEstimation: 5,
      completed: true,
      checklist: {
        id: 'checklist-12',
        title: 'Setup de testing',
        items: [
          { id: 'item-12-1', text: 'Configurar Jest', completed: true },
          { id: 'item-12-2', text: 'Configurar React Testing Library', completed: true },
          { id: 'item-12-3', text: 'Crear tests de ejemplo', completed: true },
        ],
      },
      comments: [],
      createdBy: 'user-2',
      createdAt: '2025-02-12T09:00:00Z',
      updatedAt: '2025-02-13T16:00:00Z',
      completedAt: '2025-02-13T16:00:00Z',
    },
    'task-13': {
      id: 'task-13',
      title: 'Configuración de variables de entorno',
      description: 'Establecer variables de entorno para diferentes ambientes',
      priority: 'low',
      dueDate: '2025-02-13',
      assignedMembers: ['user-2'],
      labels: ['#61BD4F'],
      timeEstimation: 2,
      completed: true,
      checklist: {
        id: 'checklist-13',
        title: 'Configuración',
        items: [
          { id: 'item-13-1', text: 'Crear archivo .env.example', completed: true },
          { id: 'item-13-2', text: 'Documentar variables', completed: true },
        ],
      },
      comments: [],
      createdBy: 'user-2',
      createdAt: '2025-02-13T09:00:00Z',
      updatedAt: '2025-02-13T11:00:00Z',
      completedAt: '2025-02-13T11:00:00Z',
    },

    // Sprint 2 tasks (completed)
    'task-7': {
      id: 'task-7',
      title: 'Desarrollo Frontend - Homepage',
      description: 'Implementar el nuevo diseño de la página principal con componentes React',
      priority: 'high',
      dueDate: '2025-03-05',
      assignedMembers: ['user-2', 'user-4'],
      labels: ['#61BD4F'],
      timeEstimation: 16,
      completed: true,
      checklist: {
        id: 'checklist-7',
        title: 'Componentes principales',
        items: [
          { id: 'item-7-1', text: 'Header responsive', completed: true },
          { id: 'item-7-2', text: 'Hero section', completed: true },
          { id: 'item-7-3', text: 'Catálogo de productos', completed: true },
          { id: 'item-7-4', text: 'Footer con newsletter', completed: true },
        ],
      },
      comments: [
        {
          id: 'comment-7-1',
          text: 'Desarrollo completado y aprobado por el cliente',
          author: 'user-2',
          createdAt: '2025-03-05T16:30:00Z',
        },
      ],
      createdBy: 'user-1',
      createdAt: '2025-02-20T09:00:00Z',
      updatedAt: '2025-03-05T16:30:00Z',
      completedAt: '2025-03-05T16:30:00Z',
    },
    'task-8': {
      id: 'task-8',
      title: 'Implementar autenticación OAuth',
      description: 'Integrar inicio de sesión con Google y Facebook',
      priority: 'high',
      dueDate: '2025-03-10',
      assignedMembers: ['user-3'],
      labels: ['#61BD4F'],
      timeEstimation: 8,
      completed: true,
      checklist: {
        id: 'checklist-8',
        title: 'Proveedores',
        items: [
          { id: 'item-8-1', text: 'Configurar Google OAuth', completed: true },
          { id: 'item-8-2', text: 'Configurar Facebook OAuth', completed: true },
        ],
      },
      comments: [
        {
          id: 'comment-8-1',
          text: 'Autenticación implementada y probada correctamente',
          author: 'user-3',
          createdAt: '2025-03-10T15:00:00Z',
        },
      ],
      createdBy: 'user-1',
      createdAt: '2025-03-01T09:00:00Z',
      updatedAt: '2025-03-10T15:00:00Z',
      completedAt: '2025-03-10T15:00:00Z',
    },
    'task-14': {
      id: 'task-14',
      title: 'Implementación de componentes base',
      description: 'Crear biblioteca de componentes base reutilizables',
      priority: 'medium',
      dueDate: '2025-03-01',
      assignedMembers: ['user-2', 'user-4'],
      labels: ['#61BD4F'],
      timeEstimation: 13,
      completed: true,
      checklist: {
        id: 'checklist-14',
        title: 'Componentes',
        items: [
          { id: 'item-14-1', text: 'Botones y variantes', completed: true },
          { id: 'item-14-2', text: 'Inputs y forms', completed: true },
          { id: 'item-14-3', text: 'Cards y containers', completed: true },
          { id: 'item-14-4', text: 'Documentación en Storybook', completed: true },
        ],
      },
      comments: [],
      createdBy: 'user-4',
      createdAt: '2025-02-20T09:00:00Z',
      updatedAt: '2025-03-01T15:00:00Z',
      completedAt: '2025-03-01T15:00:00Z',
    },
    'task-15': {
      id: 'task-15',
      title: 'Optimización de imágenes',
      description: 'Implementar sistema de optimización y lazy loading de imágenes',
      priority: 'low',
      dueDate: '2025-03-03',
      assignedMembers: ['user-2'],
      labels: ['#61BD4F'],
      timeEstimation: 5,
      completed: true,
      checklist: {
        id: 'checklist-15',
        title: 'Optimizaciones',
        items: [
          { id: 'item-15-1', text: 'Configurar next/image', completed: true },
          { id: 'item-15-2', text: 'Implementar lazy loading', completed: true },
          { id: 'item-15-3', text: 'Optimizar formatos de imagen', completed: true },
        ],
      },
      comments: [],
      createdBy: 'user-2',
      createdAt: '2025-03-01T09:00:00Z',
      updatedAt: '2025-03-03T14:00:00Z',
      completedAt: '2025-03-03T14:00:00Z',
    },
    'task-16': {
      id: 'task-16',
      title: 'Implementación de breadcrumbs',
      description: 'Crear sistema de navegación con breadcrumbs',
      priority: 'low',
      dueDate: '2025-03-04',
      assignedMembers: ['user-2'],
      labels: ['#61BD4F'],
      timeEstimation: 3,
      completed: true,
      checklist: {
        id: 'checklist-16',
        title: 'Implementación',
        items: [
          { id: 'item-16-1', text: 'Crear componente Breadcrumb', completed: true },
          { id: 'item-16-2', text: 'Integrar con next/navigation', completed: true },
        ],
      },
      comments: [],
      createdBy: 'user-2',
      createdAt: '2025-03-03T09:00:00Z',
      updatedAt: '2025-03-04T11:00:00Z',
      completedAt: '2025-03-04T11:00:00Z',
    },

    // Sprint 3 tasks (in progress)
    'task-9': {
      id: 'task-9',
      title: 'Implementar sistema de reportes',
      description: 'Desarrollar sistema de reportes y analytics para administradores',
      priority: 'high',
      dueDate: '2025-04-15',
      assignedMembers: ['user-2', 'user-3'],
      labels: ['#0079BF'],
      timeEstimation: 21,
      completed: false,
      checklist: {
        id: 'checklist-9',
        title: 'Funcionalidades requeridas',
        items: [
          { id: 'item-9-1', text: 'Diseñar dashboard', completed: true },
          { id: 'item-9-2', text: 'Implementar gráficas', completed: false },
        ],
      },
      comments: [
        {
          id: 'comment-9-1',
          text: 'Diseño del dashboard aprobado, comenzando implementación',
          author: 'user-2',
          createdAt: '2025-03-22T10:00:00Z',
        },
      ],
      createdBy: 'user-1',
      createdAt: '2025-03-20T11:00:00Z',
      updatedAt: '2025-03-22T10:00:00Z',
    },
    'task-10': {
      id: 'task-10',
      title: 'Integración de sistema de pagos',
      description: 'Implementar pasarela de pago con Stripe y PayPal',
      priority: 'medium',
      dueDate: '2025-04-20',
      assignedMembers: ['user-2', 'user-3'],
      labels: ['#0079BF', '#F2D600'],
      timeEstimation: 13,
      completed: false,
      checklist: {
        id: 'checklist-10',
        title: 'Implementación',
        items: [
          { id: 'item-10-1', text: 'Configurar Stripe', completed: false },
          { id: 'item-10-2', text: 'Configurar PayPal', completed: false },
          { id: 'item-10-3', text: 'Implementar webhooks', completed: false },
        ],
      },
      comments: [],
      createdBy: 'user-1',
      createdAt: '2025-03-21T11:00:00Z',
      updatedAt: '2025-03-21T11:00:00Z',
    },
  },
}
