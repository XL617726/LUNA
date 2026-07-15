# CLAUDE.md — LUNA 项目开发指南

> 每个新 Claude Code 会话开始时阅读此文件。

---

## 项目身份

**LUNA · 星光歌姬** — 数字音乐角色生命系统。

不是小程序。不是聊天机器人。不是音乐播放器。

这是为 L shuo 制作的一份会成长的数字礼物。

---

## 当前状态

| 指标 | 值 |
|------|-----|
| 版本 | v1.0.20 |
| 提交 | 58 commits |
| 测试 | 155/155 pass · 15 files |
| 引擎 | 10 packages |
| Web | 8 pages · PWA · Demo mode |
| Miniapp | 7 pages |
| 后端 | 17 API · 6 schemas · 5 functions |
| 资产 | Identity Sheet · 14 layers · Live2D mapping |

---

## 架构规则（不可违反）

```
apps/      → 纯展示层（不写业务逻辑）
packages/  → 所有核心能力（跨平台复用）
backend/   → API + 数据库 + 存储
assets/    → 角色素材 + 配置
```

---

## 常用命令

```bash
npm install                     # 安装依赖
npm run dev                     # apps/web 下启动 dev server
npm run build && npm start     # 生产构建 + 启动
npx vitest run                  # 运行测试 (155/155)
```

---

## 引擎清单

1. shared-types · 2. character-engine · 3. animation-engine
4. audio-engine · 5. ai-engine · 6. story-engine
7. world-engine · 8. live2d-engine · 9. pixi-engine · 10. ui-system

---

## 已知待办

1. 素材未到位: 等待真人照片 → AI 生成 Pixel Sprite
2. Miniapp 未测试: 需要微信开发者工具
3. 后端未部署: 需要 CloudBase 环境

---

## 用户上下文

- 默认昵称: `L shuo`
- GitHub: https://github.com/XL617726/LUNA
- 桌面: `C:\Users\Lzh13\Desktop\LUNA\`
- Demo: `http://localhost:3000/?demo`
