/**
 * LUNA Web — 入口
 * 验证 @luna/* 引擎包在标准 Web 环境的跨平台复用
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

console.log('[LUNA Web] 🌙 星光歌姬 Web 版已启动')
