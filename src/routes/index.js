import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Import Views
import Sign_in from '../views/sign_in.vue';
import Sign_up from '../views/sign_up.vue';
import navBar from '../components/navBar.vue';
import forget_password from '../views/forget_password.vue';
import admin_panel from '../views/admin_panel.vue';

import Clients_page from '@/views/clients_page.vue';
import Product_page from '@/views/product_page.vue';
import Orders_page from '@/views/orders_page.vue';
import password_reset from '@/views/password_reset'

const routes = [
  {
    path: '/',
    redirect: '/sign_in', // Default to Sign-In
  },
  {
    path: '/sign_in',
    name: 'sign_in',
    component: Sign_in,
    meta: { requiresGuest: true }, // Accessible only to guests
  },
  {
    path: '/sign_up',
    name: 'sign_up',
    component: Sign_up,
    meta: { requiresGuest: true }, // Accessible only to guests
  },
  {
    path: '/navBar',
    name: 'navBar',
    component: navBar,
    meta: { requiresAuth: true }, // Accessible only to logged-in users
  },
  {
    path: '/forget_password',
    name: 'forget_password',
    component: forget_password,
    meta: { requiresGuest: true }, // Accessible only to guests
  },
  {
    path: '/admin_panel',
    name: 'admin_panel',
    component: admin_panel,
    meta: { requiresAuth: true }, // Accessible only to logged-in users
  },
  {
    path: '/password-reset/:token',
    name: 'password-reset',
    component: password_reset,
    meta: { requiresGuest: true }, // Accessible only to guests
  },
  {
    path: '/clients_page',
    name: 'clients_page',
    component: Clients_page,
    meta: { requiresAuth: true }, // Accessible only to logged-in users
  },
  {
    path: '/product_page',
    name: 'product_page',
    component: Product_page,
    meta: { requiresAuth: true }, // Accessible only to logged-in users
  },
  {
    path: '/orders_page',
    name: 'orders_page',
    component: Orders_page,
    meta: { requiresAuth: true }, // Accessible only to logged-in users
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, // Correctly use routes here
});

// Global Route Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Check if the user is authenticated
  const isAuthenticated = !!auth.authToken;

  // If route requires guest access and user is logged in, redirect to admin_panel
  if (to.meta.requiresGuest && isAuthenticated) {
    return next('/admin_panel');
  }

  // If route requires authentication and user is not logged in, redirect to sign_in
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/sign_in');
  }

  // Proceed to the route
  next();
});

export default router;
