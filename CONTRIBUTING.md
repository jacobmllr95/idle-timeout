# Contributing

Thanks for taking the time to improve `idle-timeout`.

This is a small library, so the contribution process should stay lightweight: clear issue, focused change, passing checks.

## Before Opening a Pull Request

- Search existing issues and pull requests first.
- For larger changes, open an issue before starting implementation.
- Keep pull requests focused on one bug fix or feature.
- Do not include generated or unrelated changes unless they are required.
- Do not report security vulnerabilities publicly. See [SECURITY.md](SECURITY.md) instead.

## Local Development

This project uses Node.js and pnpm.

Requirements:

- Node.js `>=22.14.0`
- pnpm `10.34.1`

Setup:

```bash
pnpm install
```

Useful commands:

```bash
pnpm lint
pnpm test
pnpm test:coverage
pnpm build
```

For browser tests, install the Playwright browsers once:

```bash
pnpm exec playwright install
pnpm test:e2e
```

## Pull Request Checklist

Before opening or updating a pull request, please make sure:

- The change is covered by unit tests or e2e tests when behavior changes.
- `pnpm lint` passes.
- `pnpm test:coverage` passes.
- `pnpm build` passes.
- Dependency changes are intentional and reflected in `pnpm-lock.yaml`.
- Public API changes are documented in `README.md`.

## Reporting Bugs

Bug reports are most helpful when they include:

- The `idle-timeout` version.
- Browser and runtime versions.
- A minimal reproduction.
- Expected behavior.
- Actual behavior.

If the behavior depends on timers or browser events, please include the smallest example that demonstrates the issue.

## Proposing Features

Please describe:

- The use case.
- Why the existing API is not enough.
- Any compatibility concerns for browser users.

Small, composable API additions are preferred over broad abstractions.

## Dependency and Release Changes

Dependency, workflow, and publishing changes affect the package supply chain. Please keep them easy to review:

- Explain why each dependency change is needed.
- Avoid adding runtime dependencies unless there is a strong reason.
- Keep GitHub Actions permissions minimal.
- Preserve npm provenance and trusted publishing.
- Do not introduce long-lived publishing tokens.

## Code Style

Follow the existing TypeScript style and keep comments focused on behavior that is not obvious from the code. Formatting is handled by Prettier.
