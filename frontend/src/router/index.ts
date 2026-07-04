import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

// Lazy load views
const LoginView = () => import('@/views/LoginView.vue');
const DashboardView = () => import('@/views/DashboardView.vue');
const AttendanceView = () => import('@/views/AttendanceView.vue');
const SchedulesView = () => import('@/views/SchedulesView.vue');
const VisitorsView = () => import('@/views/VisitorsView.vue');
const ReportsView = () => import('@/views/ReportsView.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false, title: 'Login' },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Dashboard' },
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: AttendanceView,
    meta: { requiresAuth: true, title: 'Attendance Sheet', requiredRole: 'admin' },
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: SchedulesView,
    meta: { requiresAuth: true, title: 'Teacher Schedules', requiredRole: 'admin' },
  },
  {
    path: '/visitors',
    name: 'Visitors',
    component: VisitorsView,
    meta: { requiresAuth: true, title: 'Visitor Logs' },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { requiresAuth: true, title: 'Attendance Reports' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const { isAuthenticated, userRole } = useAuth();

  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} - Teacher Attendance System` 
    : 'Teacher Attendance System';

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  // If already logged in, redirect from login to dashboard
  if (to.name === 'Login' && isAuthenticated.value) {
    next({ name: 'Dashboard' });
    return;
  }

  // Check role requirements
  if (to.meta.requiredRole && userRole.value !== to.meta.requiredRole && userRole.value !== 'admin') {
    next({ name: 'Dashboard' });
    return;
  }

  next();
});

export default router;