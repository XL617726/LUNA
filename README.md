# LUNA · 星光歌姬 v1.0

> 一个会唱歌、会陪伴、保存朋友故事的数字音乐小世界。
>
> **不是小程序。是一个多端数字角色生命系统。**

[![License](https://img.shields.io/badge/license-private-orange)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.4-green)](https://vuejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0-yellow)](https://pnpm.io/)

---

## 快速开始

```bash
git clone https://github.com/XL617726/LUNA.git
cd LUNA
pnpm install
pnpm --filter @luna/web dev
# → http://localhost:3000
```

---

## 项目架构

```
LUNA/
├── packages/              10 引擎包（跨平台共享）
│   ├── shared-types/       57 个 TypeScript 类型定义
│   ├── character-engine/   角色引擎 — "她是谁"
│   ├── animation-engine/   动画引擎 — "她怎么动"
│   ├── audio-engine/       音频引擎 — "她如何感受音乐"
│   ├── ai-engine/          AI 引擎 — "她是什么性格"
│   ├── story-engine/       剧情引擎 — "她和用户经历什么"
│   ├── world-engine/       世界引擎 — 场景/天气/时间
│   ├── live2d-engine/      Live2D 接口层
│   ├── pixi-engine/        PixiJS 渲染器
│   └── ui-system/          11 UI 组件 · 63 设计令牌
│
├── apps/                   客户端（纯展示层）
│   ├── web/                Vue3 + Vite → :3000
│   ├── miniapp/            uni-app 微信小程序
│   └── desktop/            Electron（骨架）
│
├── backend/                后端服务
│   ├── api/                17 REST 端点 · 6 MongoDB Schemas
│   └── storage/            腾讯云 COS
│
├── cloudfunctions/         5 个微信云函数
├── assets/                 角色资产（Character Bible + DNA + 18 Sprite Configs）
├── docs/                   文档（开发计划 · 美术管线 · Prompt Kit）
├── tests/                  Vitest + Playwright
├── .github/workflows/      CI/CD 自动部署
└── scripts/                初始化 + 部署脚本
```

---

## 功能矩阵

| 功能 | Web | 说明 |
|------|-----|------|
| 🎬 初见剧情 | ✅ | Chapter 0：黑屏→星光→LUNA转身→打字机对白 |
| 🏠 音乐房间 | ✅ | 家具交互 + 星光粒子 + 天气场景 |
| 👧 像素角色 | ✅ | Canvas 2D 渲染 · 3 形态差异化 · 动画状态机 |
| 🎤 唱歌表演 | ✅ | 上传→BPM分析→舞台灯光→演唱→保存回忆 |
| 🎼 音乐管理 | ✅ | Web Audio 播放 · 列表管理 · 进度控制 |
| 👗 角色切换 | ✅ | 毕业生/女主播/CEO · 动画过渡 |
| 💬 AI 对话 | ✅ | 场景检测 · 记忆上下文 · 快捷回复 |
| 💫 回忆系统 | ✅ | 时间线 · 里程碑 · 隐藏剧情 |
| 📈 成长系统 | ✅ | Lv1-Lv4 互动天数升级 |
| ⭐ 彩蛋系统 | ✅ | 星星按钮 · 夜间语音 · 生日场景 |

---

## 角色档案

**LUNA** (LUNA-001) — `warm_music_dreamer`

| 形态 | 主题 | 场景 | 解锁 |
|------|------|------|------|
| 🎓 毕业生 | 《那个夏天》 | 校园 | Lv1 |
| 🎤 女主播 | 《第一次站上舞台》 | 直播间 | Lv2 |
| 💼 CEO | 《未来的自己》 | 办公室 | Lv3 |

---

## 技术栈

| 层 | 技术 |
|----|------|
| 小程序 | uni-app + Vue3 + Canvas 2D |
| Web | Vue3 + Vite + Canvas 2D |
| 引擎 | TypeScript (57 shared types) |
| 动画 | 状态机驱动 · PixiJS 预留 |
| 后端 | Node.js + CloudBase |
| 数据 | MongoDB (6 collections) |
| 存储 | 腾讯云 COS |
| 测试 | Vitest + Playwright |
| CI/CD | GitHub Actions |
| 包管理 | pnpm workspace |

---

## 开发规范

```
apps 负责展示    → 不写业务逻辑
packages 负责能力 → 所有客户端复用
backend 负责数据  → API + 存储
assets 负责资源   → CDN 部署
```

- 所有业务逻辑放入 `packages/`
- 所有状态采用 Pinia
- 所有动画通过 AnimationEngine
- 页面只负责展示
- Commit: `feat(scope): message` (Conventional Commits)

---

## 许可证

Private — 属于朋友的私人数字音乐小世界。
