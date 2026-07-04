# Notes for AI coding agents

This repo runs Next.js 16, which is newer than most training data and has real breaking changes (route conventions, middleware → `proxy.ts`, etc.). Before generating Next.js-specific code, check `node_modules/next/dist/docs/` for the current APIs rather than assuming an older version's conventions, and follow any deprecation notices you find there.

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the stack, schema, and file layout, and [`docs/DEVELOPMENT_LOG.md`](./docs/DEVELOPMENT_LOG.md) for the gotchas already found during development (Prisma v7 import paths, Base UI vs. Radix, Clerk keyless-mode quirks, etc.) — worth reading before re-discovering them.
