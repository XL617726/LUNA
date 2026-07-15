# LUNA 开发路线图

## ✅ v1.0 — Release Candidate (已完成)

- [x] Monorepo 工程架构 (pnpm workspace)
- [x] 10 引擎包 (character/animation/audio/AI/story/world/live2d/pixi/ui-system/shared-types)
- [x] 57 个 TypeScript 类型定义
- [x] Web Demo (7 pages, 14 @luna/* cross-refs)
- [x] Pixel LUNA Canvas 渲染 (3 形态差异化)
- [x] 动画状态机 (idle→sing→dance→happy→bow)
- [x] Web Audio 播放 + BPM 分析
- [x] AI 人格对话 (场景检测 + 记忆上下文)
- [x] Chapter 0 初见剧情
- [x] 回忆系统 (时间线 + 里程碑)
- [x] 成长系统 (Lv1-Lv4)
- [x] 彩蛋系统 (星星/夜间/生日/连续播放)
- [x] 后端 API (17 端点 + 6 DB Schemas)
- [x] CloudBase 云函数 (5 functions)
- [x] 角色资产管线 (Character Bible + DNA + Prompt Kit + 18 Sprite Configs)
- [x] UI System (11 组件 + 63 设计令牌)
- [x] CI/CD (GitHub Actions)
- [x] 测试框架 (Vitest + Playwright)
- [x] Git 仓库 + Conventional Commits

---

## 🔜 v1.1 — 素材到位

- [ ] 提供真人照片 → 执行 Prompt 01
- [ ] 生成 LUNA 正面 Pixel 立绘
- [ ] 锁定 Character DNA → 批量生成 18 张 Sprite PNG
- [ ] Aseprite 修正像素
- [ ] 素材放入 `assets/characters/LUNA/`
- [ ] WebCharacter 自动从占位 → 真实 Sprite

---

## 🔜 v1.2 — 微信小程序

- [ ] uni-app 项目编译运行
- [ ] 微信开发者工具调试
- [ ] 真机测试 (iPhone + Android)
- [ ] CloudBase 环境配置
- [ ] 云函数部署上线
- [ ] 小程序审核提交

---

## 🔜 v1.3 — Live2D 升级

- [ ] Live2D Cubism SDK 集成
- [ ] LUNA 模型建模 (Prompt 07)
- [ ] 音频驱动嘴型 + 身体动作
- [ ] 表情实时切换

---

## 🔜 v2.0 — 多端发布

- [ ] Web 正式版部署
- [ ] 桌面版 (Electron)
- [ ] PixiJS 渲染升级
- [ ] 世界系统完整实现 (天气/季节/事件)
- [ ] 多人互动

---

## 💡 想法池

- [ ] AR 版本 (手机摄像头 → LUNA 出现在现实空间)
- [ ] 语音输入对话
- [ ] 自定义房间装修
- [ ] 歌曲推荐系统
- [ ] 年度回忆视频生成
- [ ] 多角色支持
