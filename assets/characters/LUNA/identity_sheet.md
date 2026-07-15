# LUNA Character Identity Sheet

> 真人照片分析 → 特征提取 → AI生成参考
> 这是所有角色资产的唯一身份来源。修改此文件即修改 LUNA。

---

## 📷 照片采集清单

| # | 类型 | 用途 | 状态 |
|---|------|------|------|
| ① | 正脸照 | 脸型/眼睛/鼻子/嘴型 | ⬜ 待提供 |
| ② | 45°侧脸 | 下颌线/鼻梁/发型轮廓 | ⬜ 待提供 |
| ③ | 全身照 | 身材比例/站姿/穿衣风格 | ⬜ 待提供 |
| ④ | 生活状态照 | 唱歌/拿麦克风 → 人格提取 | ⬜ 待提供 |
| ⑤ | 造型照 | 毕业服/主播服/职业装 | ⬜ 待提供 |

---

## 👤 Basic

| 字段 | 值 |
|------|-----|
| 姓名 | LUNA |
| 年龄感 | 20-22岁 |
| 角色定位 | 音乐少女 / 虚拟歌姬 |
| 性格关键词 | 温柔 · 活泼 · 热爱唱歌 · 有一点害羞 · 怀旧 · 有梦想 |

---

## 😊 Face

| 特征 | 描述 | AI提示词 |
|------|------|----------|
| 脸型 | 椭圆脸 (oval face) | soft oval face, natural proportions |
| 下颌线 | 柔和曲线 (soft curve) | gentle jawline, not pointed |
| 眼睛 | 偏圆，眼神温柔 | round-almond eyes, warm gaze |
| 眼尾 | 微微下弯（月牙眼） | slightly downturned outer corners |
| 眉毛 | 自然平眉 | natural straight brows, not arched |
| 鼻子 | 小巧直鼻 | small straight nose |
| 嘴型 | 微笑感明显，嘴角自然上扬 | naturally upturned lips, gentle smile |
| 肤色 | 暖白皮 | warm fair skin |

---

## 💇 Hair

| 特征 | 描述 | AI提示词 |
|------|------|----------|
| 颜色 | 黑棕色 | dark brown, natural black |
| 长度 | 中长发（过肩） | shoulder-length |
| 刘海 | 侧分空气刘海 | side-parted air bangs |
| 质感 | 柔顺，发尾轻微弯曲 | soft texture, slight wave at ends |
| 扎发 | 偶尔低马尾（毕业生形态） | occasional low ponytail |

---

## 🧍 Body

| 特征 | 值 |
|------|-----|
| 身高（游戏比例） | 160cm |
| 体型 | 纤细，匀称 |
| 头身比 | 1:6.5（头30% 身体70%） |
| 肩宽 | 适中偏窄 |

---

## 🎭 Personality

| 关键词 | 权重 |
|--------|------|
| 温柔 (warm) | ★★★★★ |
| 活泼 (cheerful) | ★★★★ |
| 热爱唱歌 (music lover) | ★★★★★ |
| 有一点害羞 (slightly shy) | ★★★ |
| 怀旧 (nostalgic) | ★★★★ |
| 有梦想 (dreamer) | ★★★★★ |

---

## ⭐ Signature Features（不可变）

| # | 特征 | 检查方法 |
|---|------|----------|
| 1 | 眼睛形状 — 偏圆月牙眼 | 对比正脸照眼角弧度 |
| 2 | 发型轮廓 — 侧分空气刘海 + 过肩长发 | 刘海方向 + 长度 |
| 3 | 笑容 — 嘴角自然上扬 | 对比嘴角弧度 |
| 4 | 标志性服饰 — 学士服 / 主播装 / 西装 | 每套服装独立验证 |

---

## 🎨 Style Reference

| 参考 | 说明 |
|------|------|
| Stardew Valley | 像素风格 + 温暖色调 |
| Pokémon GBA | 角色比例 + 动画帧率 |
| Nintendo Indie | 高品质像素 + 游戏资产标准 |

---

## 📐 Pixel Sprite 规格

| 尺寸 | 用途 |
|------|------|
| 128×128 | 小程序显示（标准） |
| 256×256 | 高清版本 |
| 512×512 | 动画参考 |

比例：头30% · 身体70%（非Q版大头）

---

## 🧩 分层结构

```
LUNA/
├── body/       ← 身体 + 手臂 + 腿
├── hair/       ← hair_front / hair_back / hair_side
├── face/       ← 面部基础
├── eyes/       ← eye_left / eye_right / blink
├── mouth/      ← mouth_close / mouth_a / mouth_o / mouth_smile
├── clothes/    ← graduation / live / CEO
├── accessory/  ← 麦克风 / 眼镜 / 学士帽
└── effect/     ← 星光 / 音符
```

---

## 🎬 资产状态追踪

| 层 | 文件 | 状态 |
|----|------|------|
| body | body.png | ⬜ 等待照片 |
| hair_front | hair_front.png | ⬜ |
| hair_back | hair_back.png | ⬜ |
| eyes_open | eyes_open.png | ⬜ |
| eyes_close | eyes_close.png | ⬜ |
| mouth_close | mouth_close.png | ⬜ |
| mouth_open | mouth_open.png | ⬜ |
| mouth_smile | mouth_smile.png | ⬜ |
| outfit_graduation | graduation.png | ⬜ |
| outfit_live | live.png | ⬜ |
| outfit_ceo | ceo.png | ⬜ |

---

> **下一步**：提供5张照片 → 提取特征 → 执行 Prompt 01 → 生成角色原画
