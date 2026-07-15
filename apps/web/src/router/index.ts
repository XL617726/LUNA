import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/gift', name: 'gift', component: () => import('@/pages/GiftPage.vue') },
  { path: '/', name: 'index', component: () => import('@/pages/IndexPage.vue') },
  { path: '/music', name: 'music', component: () => import('@/pages/MusicPage.vue') },
  { path: '/character', name: 'character', component: () => import('@/pages/CharacterPage.vue') },
  { path: '/memory', name: 'memory', component: () => import('@/pages/MemoryPage.vue') },
  { path: '/setting', name: 'setting', component: () => import('@/pages/SettingPage.vue') },
  { path: '/perform', name: 'perform', component: () => import('@/pages/PerformancePage.vue') },
  { path: '/chat', name: 'chat', component: () => import('@/pages/ChatPage.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
