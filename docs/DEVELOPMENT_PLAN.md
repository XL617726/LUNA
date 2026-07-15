# LUNA · 星光歌姬 — 开发计划

> 版本：V1.0 | 总任务数：8 | 预计迭代周期：8轮

---

## 总体规划图

```
Task01 ──→ Task02 ──→ Task03 ──→ Task04
  │                              │
  └── 基础骨架               动画内核 ──→ Task05
                                 │         │
                                 │    上传系统
                                 ↓         ↓
                              Task06 ──→ Task07 ──→ Task08
                              角色切换    AI系统     整体整合
```

---

## Task01 · 初始化项目结构

**目标**：搭建可运行的 uni-app 微信小程序骨架

### 工作内容

| # | 事项 | 文件 |
|---|------|------|
| 1.1 | 初始化 uni-app 项目 | `package.json`, `manifest.json` |
| 1.2 | 配置 pages.json 路由 | `pages.json` |
| 1.3 | 创建全局样式与主题变量 | `uni.scss`, `App.vue` |
| 1.4 | 创建 Pinia 状态管理 | `store/` |
| 1.5 | 创建工具函数骨架 | `utils/audioAnalyzer.js`, `utils/stateMachine.js`, `utils/storage.js` |
| 1.6 | 建立素材目录与占位规范 | `assets/` 下全部子目录 + 素材接口文档 |
| 1.7 | 配置微信小程序 appId | `manifest.json` |

### 验收标准

- `npm run dev:mp-weixin` 可启动
- 微信开发者工具可打开项目
- 5 个页面路由可正常跳转（空白页面）
- 深色主题全局样式生效

### 产出物

```
新增: package.json, manifest.json, pages.json, uni.scss, App.vue, main.js
新增: store/index.js, store/character.js, store/music.js
新增: utils/audioAnalyzer.js, utils/stateMachine.js, utils/storage.js
新增: 5个页面的 .vue 占位文件
```

---

## Task02 · 完成 PixelCharacter 组件

**目标**：像素角色在 Canvas 上渲染并支持素材切换

### 工作内容

| # | 事项 | 文件 |
|---|------|------|
| 2.1 | 实现 Canvas 初始化与像素渲染引擎 | `components/PixelCharacter/PixelCharacter.vue` |
| 2.2 | 实现 Sprite 帧加载器（支持 idle/sing/dance/happy/bow/emotion） | `components/PixelCharacter/SpriteLoader.js` |
| 2.3 | 实现素材接口层（本地 PNG + 远程 COS 降级） | `components/PixelCharacter/AssetResolver.js` |
| 2.4 | 实现角色状态显示（idle 为默认姿势） | `components/PixelCharacter/PixelCharacter.vue` |
| 2.5 | 三种形态素材路径映射 | `assets/characters/LUNA/` 目录配置 |

### 技术要点

- Canvas 2D 绘制，像素风格 `imageSmoothingEnabled = false`
- Sprite 帧格式：精灵图（spritesheet），JSON 描述帧坐标
- 素材缺失时显示像素灰盒 + "等待素材" 文字

### 验收标准

- 页面出现像素角色（默认 idle 姿态）
- 切换素材路径后可显示不同形态
- 素材缺失时显示占位提示而非报错

---

## Task03 · 完成 AnimationController

**目标**：音乐驱动的角色动画状态机

### 工作内容

| # | 事项 | 文件 |
|---|------|------|
| 3.1 | 实现动画状态机（idle → sing → dance → happy → bow） | `utils/stateMachine.js` |
| 3.2 | 实现 AnimationController 组件 | `components/AnimationController/AnimationController.vue` |
| 3.3 | 实现音频数据驱动的状态切换 | 对接 `audioAnalyzer.js` |
| 3.4 | 实现过渡动画（像素碎片消散、星光出现） | `components/AnimationController/TransitionEffects.js` |
| 3.5 | 粒子特效系统（星光粒子背景） | `components/AnimationController/ParticleSystem.js` |

### 状态转换规则

```
idle ──[音乐播放]──→ sing
sing ──[BPM>110]──→ dance
dance ──[高潮段落]──→ happy
happy ──[音乐结束]──→ bow
bow ──[2s后]──────→ idle
```

> 禁止随机动画。所有状态切换必须有触发条件。

### 验收标准

- 无音乐时角色保持 idle
- 播放音乐时角色进入 sing
- 快节奏自动切换 dance
- 音乐结束角色 bow → idle

---

## Task04 · 完成 MusicPlayer

**目标**：歌曲加载、播放、节奏分析一体化

### 工作内容

| # | 事项 | 文件 |
|---|------|------|
| 4.1 | 实现音频播放控制器（播放/暂停/进度） | `components/MusicPlayer/MusicPlayer.vue` |
| 4.2 | 实现 Web Audio API 音频分析（BPM/音量/节拍/能量） | `utils/audioAnalyzer.js` |
| 4.3 | 实现可视化节奏波形 | `components/MusicPlayer/Waveform.vue` |
| 4.4 | 实现歌曲列表与切换 | `components/MusicPlayer/Playlist.vue` |
| 4.5 | 音乐数据模型与 Pinia store | `store/music.js` |

### AudioAnalyzer 输出规格

```js
{
  bpm: Number,       // 实时 BPM
  volume: 0-1,       // 当前音量
  beat: Boolean,     // 是否在重拍上
  energy: 0-1,       // 能量值（频谱平均强度）
  isClimax: Boolean  // 是否处于高潮段落
}
```

### 验收标准

- 可播放本地 MP3 / WAV / M4A
- 控制栏显示播放进度
- AudioAnalyzer 实时输出 BPM 和能量值
- 能量值变化驱动 AnimationController 状态

---

## Task05 · 完成上传系统

**目标**：用户可上传和管理自己的歌曲

### 工作内容

| # | 事项 | 文件 |
|---|------|------|
| 5.1 | UploadBox 组件（拖拽/选择/进度） | `components/UploadBox/UploadBox.vue` |
| 5.2 | 文件格式校验（MP3/WAV/M4A）与大小限制 | `components/UploadBox/FileValidator.js` |
| 5.3 | 上传至腾讯云 COS / CloudBase | `utils/uploader.js` |
| 5.4 | 歌曲元数据保存（歌名、时间、BPM、动画模式） | `store/music.js` 扩展 |
| 5.5 | 上传历史列表 | `pages/music/music.vue` |

### 歌曲数据结构

```js
{
  id: String,
  name: String,
  artist: String,
  duration: Number,    // 秒
  bpm: Number,         // 自动检测 / 手动输入
  animationMode: 'sing' | 'dance' | 'happy',
  coverUrl: String,
  fileUrl: String,
  uploadedAt: Timestamp
}
```

### 验收标准

- 点击上传按钮可选择本地音频文件
- 显示上传进度条
- 上传完成后歌曲出现在列表中
- 支持点击列表中的歌曲进行播放

---

## Task06 · 完成角色切换

**目标**：三种形态间带特效切换

### 工作内容

| # | 事项 | 文件 |
|---|------|------|
| 6.1 | CharacterSwitcher 组件 | `components/CharacterSwitcher/CharacterSwitcher.vue` |
| 6.2 | 三种形态卡片 UI（毕业生/主播/CEO） | 同上 |
| 6.3 | 切换过渡动画：像素碎片消散 + 星光出现 | `components/CharacterSwitcher/SwitchTransition.js` |
| 6.4 | 场景背景同步切换 | `components/SceneManager/SceneManager.vue` |
| 6.5 | 形态数据持久化（记住用户选择） | `store/character.js` |

### 切换流程

```
用户点击形态卡片
  → 当前角色像素碎片消散动画（~400ms）
  → 星光粒子过渡（~300ms）
  → 新形态角色从星光中浮现（~400ms）
  → 背景场景同步切换
  → 完成
```

### 验收标准

- 角色中心页面展示三个形态卡片
- 点击卡片触发完整切换动画
- 首页角色同步更新为新形态
- 重启小程序后记住上次选择

---

## Task07 · 完成 AI 人格和记忆

**目标**：LUNA 拥有温暖的个性和持久记忆

### 工作内容

| # | 事项 | 文件 |
|---|------|------|
| 7.1 | 人格系统（warm_music_dreamer） | `AI/personality.js` |
| 7.2 | 对话系统（短句、自然、有温度） | `AI/dialogue.js` |
| 7.3 | 记忆系统（首次上传/常听歌曲/生日/留言） | `AI/memory.js` |
| 7.4 | 成长系统（Lv1-Lv4） | `AI/growth.js` |
| 7.5 | 隐藏剧情触发系统 | `AI/story.js` |
| 7.6 | 语音合成接口（预留） | `AI/voice.js` |

### 人格参数

```js
{
  id: 'warm_music_dreamer',
  name: 'LUNA',
  traits: {
    warmth: 0.9,      // 温柔
    energy: 0.7,      // 活泼
    nostalgia: 0.8,   // 怀旧
    dream: 0.85       // 梦想
  },
  speakingStyle: 'short_sentences',  // 短句
  tone: 'natural_warm'              // 自然温暖
}
```

### 成长等级

| 等级 | 名称 | 解锁条件 | 解锁内容 |
|------|------|----------|----------|
| Lv1 | 初见 | 首次打开 | 基础动作、问候语 |
| Lv2 | 熟悉 | 累计播放10首 | 新语音、dance 动作 |
| Lv3 | 朋友 | 累计30天互动 | 新场景、happy 动作 |
| Lv4 | 星光伙伴 | 隐藏条件 | 隐藏剧情、全动作 |

### 隐藏彩蛋

- 🎉 首次打开：`"你好，我等你很久了。"`
- 🌙 夜晚（20:00-06:00）：特殊语音
- 🎂 生日：生日场景自动触发
- 🎵 连续播放10首：解锁隐藏歌曲
- ⭐ 点击星星按钮：显示制作人留言

### 验收标准

- 首次打开显示特殊问候语
- 上传第一首歌后 LUNA 记住并提及
- 互动天数影响 LUNA 对话内容
- 可查看成长等级和已解锁内容

---

## Task08 · 整体整合

**目标**：所有模块串联，完整可用的音乐小屋

### 工作内容

| # | 事项 |
|---|------|
| 8.1 | 首页完整布局（角色 + 舞台 + 麦克风 + 星光粒子） |
| 8.2 | 音频分析 → 动画状态机 → 角色渲染 全链路联调 |
| 8.3 | 角色切换 → 背景切换 → 素材更新 全链路联调 |
| 8.4 | 回忆空间页面（图片墙 + 留言 + 隐藏剧情入口） |
| 8.5 | 设置页面（清除缓存、关于、制作人留言） |
| 8.6 | 全局性能优化（Canvas 帧率、内存管理） |
| 8.7 | 错误边界与降级处理 |
| 8.8 | 真机测试与调试 |

### 最终验收标准（来自文档）

- [x] 打开程序 → 进入 LUNA 音乐小屋
- [x] 看到角色
- [x] 点击麦克风 → 角色唱歌
- [x] 音乐改变动作
- [x] 可以切换三个身份
- [x] 可以上传歌曲
- [x] 拥有回忆和成长

---

## 风险与依赖

| 风险 | 等级 | 应对策略 |
|------|------|----------|
| 角色 PNG 素材未到位 | 🔴 高 | 创建素材接口层，用色块占位先跑通逻辑 |
| 微信小程序音频 API 限制 | 🟡 中 | 提前验证 `InnerAudioContext` 能力边界 |
| Canvas 性能在低端机不足 | 🟡 中 | 控制粒子数量、降低 Sprite 帧率到 12fps |
| 云开发费用 | 🟢 低 | 初期使用本地存储，云存储按需启用 |

---

## 开发约定

1. **每个 Task 结束后**：说明完成内容、文件变化、测试方法、下一步建议
2. **角色一致性优先**：所有动画/对话必须符合 LUNA 人格设定
3. **素材缺失不阻塞逻辑**：素材接口 + 占位图先行
4. **禁止**：随机人物、普通 AI 头像、普通播放器 UI
