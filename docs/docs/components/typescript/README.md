# TypeScript components

::: tip
🎉 Calling all TypeScript developers 🎉

TypeScript components are in **beta**, and we're looking for feedback. Please see our list of [known issues](#known-issues), start writing TypeScript components, and give us feedback in [our community](https://pipedream.com/support).

During the beta, the `@pipedream/types` package and other TypeScript configuration in the `pipedream` repo is subject to change.
:::

[[toc]]

## Why TypeScript?

Most Pipedream components in [the registry](https://github.com/PipedreamHQ/pipedream/) are written in Node.js. Writing components in TypeScript can reduce bugs and speed up development, with very few changes to your code.

If you haven't written TypeScript, start with [this tutorial](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).

## Quickstart

::: tip
If you've never developed Pipedream components before, [start here](/components/).
:::

### Developing TypeScript components in the `PipedreamHQ/pipedream` registry

1. [Fork and clone the repo](https://github.com/PipedreamHQ/pipedream/).

2. Run `npm ci` to install dependencies.

3. See [the RSS sources and actions](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) for example `tsconfig.json` configuration and TypeScript components. If the app you're working with doesn't yet have a `tsconfig.json` file, copy the file from the RSS component directory and modify accordingly.

4. In the RSS examples, you'll see how we use the `defineApp`, `defineAction`, and `defineSource` methods from the `@pipedream/types` package. This lets us strictly-type `this` in apps and components. See [the TypeScript docs on `ThisType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype) for more detail on this pattern.

5. Before you publish components to Pipedream, you'll need to compile your TypeScript to JavaScript. Run:

```bash
npm run build
``` 

The build process should print the compiled JS files to your console.

6. Use [the Pipedream CLI](/cli/reference/) to `pd publish` or `pd dev` the JavaScript components emitted by step 5.

7. If it doesn't exist in the app directory, add a `.gitignore` file that ignores the following files. Commit only `ts` files to Git, not compiled `*js` files.

```
*.js
*.mjs
dist
```

### Developing TypeScript components in your own application

First, install the `@pipedream/types` package:

```bash
# npm
npm i --save-dev @pipedream/types
# yarn
yarn add --dev @pipedream/types
```

You'll need a minimal configuration to compile TypeScript components in your application. In the Pipedream registry, we use this setup:

- The `tsconfig.json` in the root of the repo contains [references](https://www.typescriptlang.org/docs/handbook/project-references.html) to component app directories. For example, the root config provides a reference to the `components/rss` directory, which contains its own `tsconfig.json` file. 
- `npm run build` compiles the TypeScript in all directories in `references`.
- The `tsconfig.json` in each component app directory contains the app-specific TypeScript configuration.
- The GitHub actions in `.github/workflows` compile and publish our components. 

See [the RSS sources and actions](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) for an example app configuration.

## Known issues

We welcome PRs in [the `PipedreamHQ/pipedream` repo](https://github.com/PipedreamHQ/pipedream), where we store all sources and actions, the `@pipedream/types` package, these docs, and other Pipedream code. Here are a few known issues durin the **beta**:

- `this` is strictly-typed within `methods`, `run`, `hooks`, and everywhere you have access to `this` in [the component API](/components/api/). But this typing can be improved. For example, we don't yet map props to their appropriate TypeScript type (everything is typed with `any`).
- The compile -> publish lifecycle hasn't been fully-automated when you're developing in the `pipedream` repo. Currently, you have to run `npm run build` from the repo root, then use the `pd` CLI to publish components after compilation. It would be nice to run `tsc-watch` and have that compile and publish the new version of the component using the `--onSuccess` flag, publishing any sources or actions accordingly.
- We should add a linter (like `dtslint`) to all TypeScript components). Currently, `dtslint` is configured only for the `@pipedream/types` package.

## `@pipedream/types`

See the `types` directory of [the `PipedreamHQ/pipedream` repo](https://github.com/PipedreamHQ/pipedream) for Pipedream types. We welcome PRs!

## Giving feedback during the beta

We welcome any feedback, bug reports, or improvements. Please reach out or submit PRs [in our Slack, Discourse and GitHub communities](https://pipedream.com/support).