# Contributing to LUNA

Thanks for contributing to LUNA · 星光歌姬!

## Development Setup

```bash
git clone https://github.com/XL617726/LUNA.git
cd LUNA
pnpm install
pnpm --filter @luna/web dev     # Start web dev server
pnpm test                         # Run tests (89/89)
```

## Project Structure

```
packages/  → Engine layer (business logic, cross-platform)
apps/      → Presentation layer (Web, Miniapp, Desktop)
backend/   → API + Database + Storage
```

**Golden Rule**: Business logic goes in `packages/`. Pages only handle presentation.

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): description    # New feature
fix(scope): description     # Bug fix
docs: description           # Documentation
test: description           # Tests
chore: description          # Maintenance
```

## Branch Strategy

- `master` — Stable releases
- `develop` — Active development
- `feature/*` — New features

## Running Tests

```bash
pnpm test              # All tests (89/89)
pnpm test:watch        # Watch mode
pnpm --filter @luna/web build  # Production build
```

## Code Style

- TypeScript with strict mode (shared-types)
- Vue 3 Composition API
- CSS Custom Properties for theming
- 2-space indentation
