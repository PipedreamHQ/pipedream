# How to Contribute to the SDK

## Local Environment Setup

### Global Dependencies

Clone the repo (ideally your own fork of it) and initialize the global
dependencies like Node.js, NPM, etc. We use [`asdf`](https://asdf-vm.com/) to
manage these, so assuming we're located in this directory (i.e. `packages/sdk/`)
we can run the following command to install them:

```shell
asdf install
```

If you prefer to use another tool make sure you use the same versions that are
specified in the `.tool-versions` files [in this current directory, and
recursively going up until you reach the root of the
repo](https://asdf-vm.com/guide/getting-started.html#_6-set-a-version).

### Local Dependencies

You can install the package's dependencies by using `pnpm` or `npm`:

```shell
pnpm install
```

Since other packages in this repository already use `pnpm`, we recommend you use
it in this case too to keep your `node_modules` footprint low.

## Build the Package

There's a script that you can invoke with `pnpm` to build the package artifacts:

```shell
pnpm build
```

You can also watch the code for changes, and automatically build a new artifact
after each change with the `watch` script:

```shell
pnpm watch
```

### Use the Package

You can use pnpm's `link` command to point other code to your local version of
this package during development. This lets you test the SDK in other local apps,
end-to-end.

In this `packages/sdk/` directory:

```shell
pnpm link --global
```

> [!NOTE]
When using the version of Node.js specified in
[`.tool-versions`](./.tool-versions) (via `asdf`), the command above will
install the package in the `asdf` Node.js environment. To use this package
elsewhere, you'll need to use the same version of Node.js. Please reference the
latest version of [the `.tool-versions` file](./.tool-versions) and add that to
the `.tool-versions` file in your local project where you'd like to use the SDK.

For example, in your app's directory:

```shell
# Replace /path/to/pipedream with the actual path to this repository
grep nodejs /path/to/pipedream/packages/sdk/.tool-versions >> .tool-versions
asdf install
pnpm install @pipedream/sdk
```

Then, link the SDK package to its local path:

```shell
pnpm link @pipedream/sdk
```

To confirm you successfully installed the correct version of the SDK, and that
it's tied to your local copy of the Pipedream SDK:

```shell
ls -l node_modules/@pipedream
```

You should see an output like this one (notice the last line):

```text
total 0
drwxr-xr-x   9 jay  staff  288 30 Oct 14:01 mysql
drwxr-xr-x  10 jay  staff  320 30 Oct 14:01 platform
lrwxr-xr-x   1 jay  staff   31 30 Oct 14:06 sdk -> ../../../pipedream/packages/sdk
```
