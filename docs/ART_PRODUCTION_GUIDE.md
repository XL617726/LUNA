# LUNA 美术资产生产管线 v2.0

> Character Asset Production Prompt Kit
> GPT Image / Midjourney / Stable Diffusion 专用

---

## 核心原则

```
真人照片 → 锁定身份特征 → 像素艺术化 → 游戏角色化 → 动画资产化
```

**不是**：照片 → 生成像素女孩（中间缺少人物特征锁定层，导致不像）

---

## 输入准备

| 输入 | 说明 |
|------|------|
| 真人正面照片 | 必须 |
| 半身照片 | 推荐 |
| 侧脸照片 | 如果有 |
| 发型描述 | 文字 |
| 性格关键词 | 文字 |
| 喜欢的服装 | 文字 |

---

## Prompt 01 · 角色正面立绘

```
Create a highly recognizable pixel art game character based on the provided real person's photo.

IMPORTANT: Preserve the person's identity.
Keep: same face shape, same hairstyle, same eye shape, same smile,
      same age feeling, same personality impression.

Character: young female singer, warm gentle personality, loves singing.

Art style: Nintendo cozy pixel art, Stardew Valley inspired,
high quality RPG character, cute but realistic proportions,
detailed pixel shading, soft warm colors.

Pose: front facing, standing naturally, full body, holding microphone.

Requirements: single character, transparent background, no text, 256x256 pixel style.
```

**负面 Prompt**：`anime girl, different person, random face, exaggerated eyes, child body, different hairstyle, realistic photo, 3D render, blurry`

---

## Prompt 02 · 侧面角色

```
Create a side profile pixel character based on the same real person.
Identity must remain identical. 90 degree side view.
Same hairstyle silhouette, same nose shape, same face proportion.
Nintendo RPG pixel character, transparent background, no text.
```

---

## Prompt 03 · 表情资产包 (7 种)

```
Create a pixel art facial expression sheet. Same character identity.
Generate: 1.neutral 2.happy smile 3.shy smile 4.surprised
5.singing 6.excited performance 7.sleepy
Nintendo cozy pixel art. Organized grid. Same face. No text.
```

---

## Prompt 04 · 唱歌 Sprite 序列 (6 帧)

```
Create a pixel animation sprite sequence. Same character.
Action: singing into microphone.
Frames: idle → raise mic → mouth open → body move → smiling → finish pose
Sprite sheet, consistent character, same size, transparent background.
```

---

## Prompt 05 · 三套服装

**毕业生**：`graduation gown, white shirt, holding flowers, nostalgic warm mood, same face identity`
**女主播**：`modern idol style, headset microphone, energetic confident mood, same face identity`
**CEO**：`elegant business suit, mature but recognizable, professional warm mood, same face identity`

---

## Prompt 06 · Sprite Sheet 完整动画

```
Create a complete pixel animation sprite sheet. LUNA character. Same identity.
Idle breathing. 8 frames. Small breathing, hair movement, eye blink.
Horizontal sprite sheet. Each frame same size/position/character. Transparent background.
```

---

## Prompt 07 · Live2D 拆分

```
Create a Live2D model preparation sheet. Same real person character.
Layers: HEAD, FACE, LEFT_EYE, RIGHT_EYE, EYEBROWS,
MOUTH_CLOSED, MOUTH_OPEN, FRONT_HAIR, BACK_HAIR,
BODY, LEFT_ARM, RIGHT_ARM, HAND
Each part separated, clear boundaries, same character, transparent background.
```

---

## Prompt 08 · Claude Code 资产规划指令

```
你现在负责 LUNA Character Asset Pipeline。
不要直接生成随机角色。
Step 1: 建立 Character DNA
Step 2: 生成 Pixel Sprite 基础设计
Step 3: 拆分层 (head/hair/face/body/hands/outfit)
Step 4: 建立 Sprite Sheet 动画规范
Step 5: 生成 Live2D 模型拆分方案
所有角色必须保持 same identity。
禁止重新设计脸、随机美化、改变年龄、改变气质。
输出: Character Bible, Asset List, Animation List, File Structure
```

---

## 完整工作流

```
真人照片
  ↓ 01 人物特征分析 → Character DNA
  ↓ 02 AI 概念设计 → 角色原画 (Prompt 01/02)
  ↓ 03 Pixel Sprite → idle/sing/dance (Prompt 04/06)
  ↓ 04 表情资产 → 7 expressions (Prompt 03)
  ↓ 05 服装变体 → 3 outfits (Prompt 05)
  ↓ 06 Aseprite 修正 → 像素修正
  ↓ 07 Sprite Sheet → spritesheet.png + .json
  ↓ 08 Live2D 建模 → Cubism 拆分 (Prompt 07)
  ↓ 09 表情动作绑定 → motions + expressions
  ↓ 10 导入 LUNA 项目
```

## 当前资产状态

| 类别 | 总数 | 到位 | 缺失 |
|------|------|------|------|
| Pixel Sprites | 12 | 0 | 12 |
| Expressions | 7 | 0 | 7 |
| Outfits | 3 | 0 | 3 |
| Live2D | 8 | 0 | 8 |
| Backgrounds | 3 | 0 | 3 |
| Effects | 3 | 0 | 3 |
| **总计** | **36** | **0** | **36** |

> ⏳ 等待真人照片 → 执行 Prompt 01
