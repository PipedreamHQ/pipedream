# Pipedream docs

## Quickstart

[Install `asdf`](https://asdf-vm.com/guide/getting-started.html) if you haven't already.

```bash
asdf install
pnpm dev
```

Open [http://localhost:3000/docs](http://localhost:3000/docs).

We use [Nextra](https://nextra.site/docs), [a Next.js app](https://nextjs.org/docs). Nextra builds docs from the `pages/` directory. All docs are [MDX](https://mdxjs.com/) files (Markdown with React components / JSX).

Run `yarn build` before pushing to your branch to confirm everything builds OK.

## VuePress -> Nextra

We're moving from VuePress to Nextra. Here's what's the same and what's different:

- New docs are here, in the `docs-v2/` directory.
- All docs are still Markdown. Now MDX files instead of just Markdown, so extensions have been renamed to `.mdx`.
- Keep images in `public/images/foo.png`, reference with `![alt text](/images/foo.png)`
- Leaf nodes in VuePress were at files like `/docs/workflows/workspaces/sso/google/README.md`. Nextra allows leaf nodes to be non-index files like `/docs/workflows/workspaces/sso/google.mdx`, so there's no need for the final directory, which simplifies things.
- VuePress used Vue, Nextra uses React. All of the custom components used in MDX files are either [built-in Nextra components](https://nextra.site/docs/guide/built-ins) or Pipedream-specific components in `components/`, ported from Vue.
- Learn the [built-in Nextra components](https://nextra.site/docs/guide/built-ins). All the `::: tip`, `::: warning`, or other special VuePress components have an equivalent Nextra component.

## Nextra

We use the [Nextra Docs Theme](https://nextra.site/docs/docs-theme/start), which adds functionality on the base Nextra app. Most of the features we use are well-documented there.

The [Nextra docs](https://nextra.site/docs) and [GitHub](https://github.com/shuding/nextra) are great. Anything not specific to Nextra is likely a feature of [Next.js](https://nextjs.org/docs) or [MDX](https://mdxjs.com/), also well-maintained and modern projects as of 2024.

Check `theme.config.tsx` for the latest config.

### Useful Nextra components

We use almost all of [the Nextra built-in components](https://nextra.site/docs/guide/built-ins) in docs.

### Adding new pages / routes

Nextra and Next.js tie routing closer to the directory structure of the app:

```
pages
  index.mdx  # /docs
  data-stores.mdx  # /docs/data-stores
  http.mdx # /docs/http
  workspaces/
    index.mdx  # /docs/workspaces
    sso/
      index.mdx  # /docs/workflows/workspaces/sso
      google.mdx  # /docs/workflows/workspaces/sso/google
```

The `_meta.tsx` files in each directory defines a mapping between the labels in the sidebar and the files in that directory. If you want to add an item to the sidebar, you'll probably want to edit the `_meta.tsx` file. [See the Nextra docs](https://nextra.site/docs/docs-theme/page-configuration) for more info.

## Custom components

Use (and create!) custom components in `components/`. You'll see a lot of references to these components in the MDX.

## Redirects

If you need to add any custom redirects, e.g. when you move pages to a different directory, add then to the `vercel.json` file in this directory.

## Adding new versions

Add a new version of docs by creating a new feature branch in the format of `docs-v{number}-pathing`.
