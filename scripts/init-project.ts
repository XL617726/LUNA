/**
 * LUNA Monorepo — 项目初始化脚本
 * 运行: pnpm init
 * 作用: 确保所有目录存在，验证工作区配置
 */
import * as fs from 'fs'
import * as path from 'path'

const REQUIRED_DIRS = [
  'apps/miniapp/pages', 'apps/web/src', 'apps/desktop/src',
  'packages/character-engine/src', 'packages/animation-engine/src',
  'packages/audio-engine/src', 'packages/ai-engine/src',
  'packages/story-engine/src', 'packages/ui-system/src',
  'packages/shared-types/src',
  'backend/api/src', 'backend/database', 'backend/storage',
  'assets/characters/LUNA/graduation', 'assets/characters/LUNA/live', 'assets/characters/LUNA/CEO',
  'assets/sprites', 'assets/live2d', 'assets/backgrounds', 'assets/effects', 'assets/music', 'assets/fonts',
  'docs', 'scripts',
]

const RESULT = { created: [] as string[], existed: [] as string[] }

for (const dir of REQUIRED_DIRS) {
  const fullPath = path.resolve(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    RESULT.created.push(dir)
  } else {
    RESULT.existed.push(dir)
  }
}

console.log('\n✨ LUNA Monorepo 初始化完成\n')
console.log(`  创建: ${RESULT.created.length} 个目录`)
console.log(`  已存在: ${RESULT.existed.length} 个目录`)
console.log('\n  下一步:')
console.log('    pnpm install        # 安装所有依赖')
console.log('    pnpm dev            # 启动所有客户端')
console.log('    pnpm typecheck      # 运行类型检查')
console.log('')
