# CLAUDE.md — LUNA 项目开发指南

> 这是给 Claude Code 的指令文件。每个新会话开始时阅读此文件。

---

## 项目身份

你正在开发 **LUNA · 星光歌姬** — 一个数字音乐角色生命系统。

**不是**普通微信小程序。**不是**聊天机器人。**不是**音乐播放器。

这是为某个人制作的一份会成长的数字礼物。

---

## 架构规则（不可违反）

```
apps/      → 纯展示层（不写业务逻辑）
packages/  → 所有核心能力（跨平台复用）
backend/   → API + 数据库 + 存储
assets/    → 角色素材 + 配置
```

- 所有业务逻辑放入 `packages/`
- 所有状态采用 Pinia（Web）/ Vue reactive（miniapp）
- 所有动画通过 AnimationEngine
- 页面只负责展示
- Commit: `feat(scope): message` (Conventional Commits)

---

## 关键路径

| 路径 | 说明 |
|------|------|
| `packages/*/src/index.ts` | 每个引擎的入口 |
| `apps/web/src/` | Web 客户端源码 (Vite + Vue3) |
| `apps/miniapp/` | 微信小程序源码 (uni-app) |
| `backend/api/src/routes/index.ts` | API 路由定义 |
| `cloudfunctions/` | 微信云函数 |
| `assets/characters/LUNA/` | 角色素材 + 配置 |
| `tests/unit/` | Vitest 单元测试 |

---

## 常用命令

```bash
pnpm install                    # 安装依赖
pnpm --filter @luna/web dev     # 启动 Web 开发服务器 (:3000)
pnpm --filter @luna/web build   # 生产构建 → apps/web/dist/
pnpm test                        # 运行测试 (38/38)
npx vite build                   # 在 apps/web/ 下构建
node server.cjs                  # 在 apps/web/ 下启动生产服务器
```

---

## 引擎清单 (10 packages)

1. **shared-types** — 57 个 TypeScript 接口/类型
2. **character-engine** — 角色档案、形态切换、精灵加载
3. **animation-engine** — 动画状态机、过渡特效、粒子
4. **audio-engine** — BPM/能量分析、文件校验、上传
5. **ai-engine** — 人格、对话、记忆、成长、语音
6. **story-engine** — 彩蛋触发、隐藏剧情
7. **world-engine** — 场景、天气、时间、事件总线
8. **live2d-engine** — Cubism 模型接口层
9. **pixi-engine** — PixiJS 渲染器
10. **ui-system** — 跨平台 UI 组件库

---

## 测试状态

- 5 test files, 38 test cases, 0 failures
- CharacterEngine, AnimationStateMachine, DialogueEngine, MemorySystem, StorySystem, AudioAnalyzer, FileValidator, SceneManager, WeatherSystem, TimeSystem, WorldEventBus

---

## 当前已知问题

1. **素材未到位**: 18 个 Sprite PNG 等待 AI 生成（见 `docs/ART_PRODUCTION_GUIDE.md`）
2. **miniapp 未测试**: 需要微信开发者工具
3. **后端未部署**: 需要 CloudBase 环境
4. **网络不稳定**: git push 偶尔失败，重试即可

---

## 用户上下文

- 默认昵称: `L shuo`
- GitHub: https://github.com/XL617726/LUNA
- 分支: `master` (v1.0.0) / `develop` (开发)
- 这是一个送给朋友的礼物
