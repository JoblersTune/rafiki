# Rafiki all in one

## Table of Contents

1. [Getting Started](#getting-started)
   1. [Workspaces](#workspaces)
      1. [How to share scripts between workspaces?](#how-to-share-scripts-between-workspaces)
   2. [Code quality](#code-quality)
      1. [Linting](#linting)
      2. [Formatting](#formatting)
      3. [Testing](#testing)
      4. [Commit hooks](#commit-hooks)
      5. [Language](#language)
      6. [CI](#ci)
2. [Packages](#packages)
   1. [Backend](#backend)
   2. [Connector](#connector)
   3. [Frontend](#frontend)
3. [Owners](#owners)

---

## Getting Started

This project uses yarn 2. We use [zero-installs](https://yarnpkg.com/features/zero-installs)
which means you won't need to install dependencies when you clone the repo.
This does have [security implications](https://yarnpkg.com/features/zero-installs#does-it-have-security-implications)
that are fairly easy to mitigate.

> DO NOT use `npm install`, this will cause the project to spontaneously self-destruct.

### Workspaces

We use [yarn workspaces](https://yarnpkg.com/features/workspaces) to manage the monorepo.
The [workspace](https://yarnpkg.com/cli/workspace) command should be used when
you want to run yarn commands in specific workspaces:

```shell
# Run a command within the specified workspace.
yarn workspace <workspaceName> <commandName> ...

# Add a package (knex) to a single workspace(backend):
yarn workspace backend add knex

# Run build script on a single workspace(backend):
yarn workspace backend build
```

#### How to share scripts between workspaces?

Any script with a colon in its name (build:foo) can be called from any workspace.
Additionally, `$INIT_CWD` will always point to the directory running the script.

We utilize this to write shared scripts once:

```shell
# Lint in the current workspace
cd packages/backend
yarn lint # runs yarn lint:local

# OR use the workspaces command
yarn workspace backend lint # runs yarn lint:local in the packages/backend directory
```

### Code quality

All the code quality tools used in the project are installed and configured at the root.
This allows for consistency across the monorepo. Allows new packages to be added with
minimal configuration overhead.

We try not to put config files in workspaces, unless absolutely necessary.

#### Linting

[Eslint](https://eslint.org/) is used for linting.

```shell
./.eslintrc.yml # config
./.eslintignore # ignore file
```

Eslint config should not be overridden in any packages.

#### Formatting

[Prettier](https://prettier.io/) is used for formatting.

```shell
./.prettierrc.yml # config
./.prettierignore # ignore file
```

Prettier config should not be overridden in any packages.

#### Testing

[Jest](https://jestjs.io/) is used for testing.

```shell
./jest.config.js # config
```

Jest config at the root is intended to be a base config that should be extended by
each package to suit the package's testing requirements.

#### Commit hooks

[Husky](https://github.com/typicode/husky) provides git hooks.

```shell
./.husky/commit-msg # linting commit messages
./.husky/pre-commit # perform functions before committing
```

[Commitlint](https://commitlint.js.org/) is used for linting commit messages
so that they conform to [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

```shell
./commitlint.config.js # config
```

[Lint-staged](https://github.com/okonet/lint-staged) is used for linting and formatting staged files on commit.

```shell
./.lintstagedrc.yml # config
```

https://commitlint.js.org

#### Language

[Typescript](https://www.staging-typescript.org/) is the chosen language.

```shell
./tsconfig.json # config
```

Typescript config at the root is intended to be a base config that should be extended by
each package to suit the package's requirements.

#### CI

We use Github actions to manage our CI pipeline.

The workflows can be found in `.github/workflows`

---

## Packages

### Backend

TODO

### Connector

TODO

### Frontend

TODO

---

## Owners

@cairinmichie
@kincaidoneil
@matdehaast
@sentientwaffle
@sharafian
@wilsonianb