# Pipedream Docs

## Modifying docs and testing locally

First, install the dependencies for the repo:

```bash
# As of this writing, node-sass doesn't have an ARM build
npm_config_arch=x64 yarn install
```

Then, run the Vuepress app locally:

```bash
yarn docs:dev
```

This should run a local development server on `http://localhost:8080/`. When you make changes to the Markdown files in the repo, the app should hot reload and refresh the browser automatically.
