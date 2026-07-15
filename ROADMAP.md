# LUNA 开发路线图

## ✅ v1.0.2 — Gift-Ready (已完成 · 27 commits)

- [x] Monorepo 工程架构 (pnpm workspace)
- [x] 10 引擎包 · 57 TypeScript 类型
- [x] Web Demo 8 页面
- [x] Pixel LUNA Canvas 渲染 (3 形态差异化)
- [x] 动画状态机 (idle→sing→dance→happy→bow)
- [x] 旋律合成器 (3 首预置歌曲 · 真实音符序列)
- [x] AI 人格对话 (场景检测 + 记忆上下文)
- [x] Chapter 0 初见剧情 (打字机效果)
- [x] 新手引导 Tour (4 步)
- [x] 回忆系统 (时间线 + 里程碑)
- [x] 成长系统 (Lv1-Lv4)
- [x] 每日签到 streak (3/7/30/100 天里程碑)
- [x] 彩蛋系统 (星星/夜间/生日/连续播放)
- [x] 礼物页面 + 专属留言 + 个性化称呼
- [x] 房间氛围 (星光粒子 · 云朵漂移 · 环境音 · 随机自语)
- [x] 表演模式 (浮空音符 · 舞台灯光)
- [x] 后端 API (17 端点 + 6 DB Schemas)
- [x] CloudBase 云函数 (5 functions)
- [x] 角色资产管线 (Character Bible + DNA + Prompt Kit + 18 Sprite Configs)
- [x] 生产部署 (Vercel config + 生产服务器 + 一键礼物脚本)
- [x] UI System (11 组件 + 63 设计令牌)
- [x] 移动端响应式适配
- [x] CI/CD (GitHub Actions)
- [x] 测试 (38/38 pass · 5 files)
- [x] 完整文档 (README · CHANGELOG · CLAUDE.md · GIFT.md)
- [x] Git (27 commits · Conventional Commits · 3 tags)

---

## 🔜 v1.1 — 素材到位

- [ ] 提供真人照片 → 执行 Prompt 01 (见 docs/ART_PRODUCTION_GUIDE.md)
- [ ] 生成 LUNA 正面 Pixel 立绘
- [ ] 锁定 Character DNA → 批量生成 18 张 Sprite PNG
- [ ] Aseprite 修正像素
- [ ] 素材放入 `assets/characters/LUNA/`
- [ ] WebCharacter 自动从占位 → 真实 Sprite

---

## 🔜 v1.2 — 微信小程序

- [ ] uni-app 项目编译运行
- [ ] 微信开发者工具调试
- [ ] 真机测试
- [ ] CloudBase 环境配置 + 云函数部署
- [ ] 小程序审核提交

---

## 🔜 v1.3 — Live2D 升级

- [ ] Live2D Cubism SDK 集成
- [ ] LUNA 模型建模
- [ ] 音频驱动嘴型 + 身体动作

---

## 🔜 v2.0 — 多端发布

- [ ] Web 正式版部署
- [ ] 桌面版 (Electron)
- [ ] PixiJS 渲染升级
- [ ] 多人互动

---

## 💡 想法池

- [ ] AR 版本
- [ ] 语音输入对话
- [ ] 自定义房间装修
- [ ] 年度回忆视频生成
