# `@pipedream/sdk`

TypeScript SDK for [Pipedream](https://pipedream.com). [See the docs](https://pipedream.com/docs/connect) for usage instructions.

## Install

```bash
npm i @pipedream/sdk
```

## Quickstart

The [quickstart](https://pipedream.com/docs/connect/quickstart) is the easiest way to get started with the SDK and Pipedream Connect.

## Usage

[See the SDK docs](https://pipedream.com/docs/connect) for full usage instructions and examples for each method.

## Example app

Clone and run the [example app](https://github.com/PipedreamHQ/pipedream-connect-examples/) to get started.

## Developing on the SDK

Clone this repo and initialize global dependencies. We use `asdf` to manage these dependencies — [install it here](https://asdf-vm.com/). Then run

```bash
asdf install
```

Install deps locally:

```bash
cd packages/sdk
npm i
```

To build the package:

```bash
npm run build
```

You can use `npm link` to point other code to the local version of the SDK you're developing on. This lets you test the SDK in other local apps, end-to-end.

First run `npm link` in the `sdk` directory:

```bash
npm link
```

Since we're using a fixed version of Node.js (provided by `asdf` above), this will install the package to the `asdf` Node environment. To use this package elsewhere, you'll need to use the same version of Node.js. Please reference the latest version of [the `.tool-versions` file](https://github.com/PipedreamHQ/pipedream/blob/master/.tool-versions) and add that either to the `.tool-versions` file in your local project where you'd like to use the SDK.

For example:

```bash
cd your_project_directory
echo `nodejs 22.10.0` >> `.tool-versions` # Please reference the latest version being used in the Pipedream public repo
```

Then, in your local project, run

```bash
npm link @pipedream/sdk
```

To confirm you successfully installed the correct version of the SDK, tied to your local copy of the Pipedream SDK:

```bash
cd node_modules/@pipedream
ls -l
```

and you should see the `sdk` package pointing to your local directory:

```bash
❯ ls -l
total 0
lrwxr-xr-x  1 dylburger  staff  34 Oct 29 20:09 sdk -> ../../../../pipedream/packages/sdk
```
