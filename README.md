# LUNA · 星光歌姬 v1.0

> 一个会唱歌、会陪伴、保存朋友故事的数字音乐小世界。
>
> **不是小程序。是一个多端数字角色生命系统。**

---

## 项目架构

```
LUNA/
├── apps/                  # 客户端（纯展示层）
│   ├── miniapp/           # 微信小程序 (uni-app + Vue3)
│   ├── web/               # Web 版 (Vue3 + Vite) [待开发]
│   └── desktop/           # 桌面版 (Electron) [待开发]
│
├── packages/              # 核心引擎（跨平台共享）
│   ├── character-engine/  # 角色引擎 — "她是谁"
│   ├── animation-engine/  # 动画引擎 — "她怎么动"
│   ├── audio-engine/      # 音频引擎 — "她如何感受音乐"
│   ├── ai-engine/         # AI 引擎 — "她是什么性格"
│   ├── story-engine/      # 剧情引擎 — "她和用户经历什么"
│   ├── ui-system/         # UI 组件库 — 像素风格主题
│   └── shared-types/      # 全局类型定义
│
├── backend/               # 后端服务
│   ├── api/               # Node.js API (CloudBase 云函数)
│   ├── database/          # MongoDB Schema
│   └── storage/           # COS 存储配置
│
├── assets/                # 静态资源（CDN 部署）
│   ├── characters/        # LUNA 角色素材
│   ├── sprites/           # 精灵图
│   ├── live2d/            # Live2D 模型
│   ├── backgrounds/       # 场景背景
│   ├── effects/           # 粒子特效
│   └── music/             # 音频文件
│
├── docs/                  # 文档
│   ├── DEVELOPMENT_PLAN.md    # 开发计划
│   ├── ART_PRODUCTION_GUIDE.md # AI 美术生产手册
│   └── ASSET_SPEC.md          # 素材技术规范
│
├── scripts/               # 工具脚本
└── pnpm-workspace.yaml    # Monorepo 工作区配置
```

## 核心原则

```
apps 负责展示    → 不写业务逻辑
packages 负责能力 → 所有客户端复用
backend 负责数据  → API + 存储
assets 负责资源   → CDN 部署
```

## 快速开始

```bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 安装所有依赖
pnpm install

# 初始化项目目录
pnpm init

# 启动微信小程序开发
pnpm --filter @luna/miniapp dev

# 运行类型检查
pnpm typecheck
```

## 角色档案

**LUNA** (LUNA-001) — warm_music_dreamer

| 形态 | 主题 | 场景 |
|------|------|------|
| 🎓 毕业生 | 《那个夏天》 | 校园 |
| 🎤 女主播 | 《第一次站上舞台》 | 直播间 |
| 💼 CEO | 《未来的自己》 | 办公室 |

## 技术栈

| 层 | 技术 |
|----|------|
| 小程序 | uni-app + Vue3 + Canvas 2D |
| Web | Vue3 + Vite + PixiJS |
| 桌面 | Electron |
| 引擎 | TypeScript |
| 后端 | Node.js + CloudBase |
| 数据 | MongoDB |
| 存储 | 腾讯云 COS |
| 包管理 | pnpm workspace |

## 开发规范

1. 所有业务逻辑放入 `packages/`
2. 所有状态采用 Pinia
3. 所有动画通过 AnimationEngine
4. 页面只负责展示
5. 服务全部放到 services
6. 每完成一个 Sprint 输出：文件列表 + ChangeLog + 测试方法

## License

Private — 属于朋友的私人数字音乐小世界。
