# Security Policy

## Supported Versions

Security fixes are released for the latest published version of `idle-timeout`. Please keep your applications on the latest version available on npm.

## Reporting a Vulnerability

Please do not report suspected vulnerabilities in public GitHub issues, discussions, pull requests, or social channels.

Use GitHub private vulnerability reporting for this repository if it is available. If that is not available, email the maintainer listed in `package.json` with the subject `Security: idle-timeout`.

Include as much of the following as you can:

- A short description of the issue and its potential impact.
- The affected `idle-timeout` version.
- A minimal reproduction or proof of concept.
- Browser, runtime, and package manager versions when relevant.
- Whether the issue is already public or known to be exploited.

You should receive an initial response within 72 hours. If the report is valid, we will coordinate a fix and disclosure timeline before publishing details.

## Scope

Security issues may include, but are not limited to:

- Behavior that allows code execution, data exposure, or privilege escalation in applications using this package.
- A packaging, build, release, or provenance problem that could affect package integrity.
- A dependency or GitHub Actions issue that could compromise published artifacts.

The following are usually not considered security vulnerabilities on their own:

- Expected behavior documented in the public API.
- Issues that require consumers to execute untrusted JavaScript intentionally.
- Reports without a practical impact on users of the package.
- Denial-of-service scenarios that only affect local development tooling.

## Supply Chain

This project uses a locked dependency graph, automated dependency updates, dependency review, registry signature checks, and npm provenance for releases. Release publishing should use GitHub Actions trusted publishing rather than a long-lived npm token.

When reviewing or contributing release-related changes, pay special attention to:

- GitHub Actions permissions.
- Pinned third-party actions and container images.
- Dependency and lockfile changes.
- Publishing configuration in `package.json` and `.github/workflows/release.yml`.
- Any change that introduces, exposes, or relies on secrets.

## Disclosure

Please give the maintainer reasonable time to investigate and release a fix before publishing details. Credit will be given when requested and appropriate.
