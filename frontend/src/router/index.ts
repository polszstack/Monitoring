import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: 'teachers',
          name: 'Teachers',
          component: () => import('@/views/TeachersView.vue')
        },
        {
          path: 'schedules',
          name: 'Schedules',
          component: () => import('@/views/SchedulesView.vue')
        },
        {
          path: 'attendance',
          name: 'Attendance',
          component: () => import('@/views/AttendanceView.vue')
        },
        {
          path: 'facilities',
          name: 'Facilities',
          component: () => import('@/views/FacilitiesView.vue')
        },
        {
          path: 'visitors',
          name: 'Visitors',
          component: () => import('@/views/VisitorsView.vue')
        }
      ]
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router