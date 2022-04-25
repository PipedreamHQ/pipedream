---
short_description: Reuse your code steps across workflows to speed up your solutions development.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646841235/docs/icons/icons8-copy-96_dx48fh.png
---

# Sharing code across workflows

Pipedream provides two ways to share code across workflows:

- **Create an action**. [Actions](/components#actions) are reusable steps. When you author an action, you can add it to your workflow like you would other actions, by clicking the **+** button below any step. [Learn how to build your first action here](/components/quickstart/nodejs/actions/).
- **Create your own npm package**. If you need to run the same Node.js code in multiple workflows, you can publish that code as an npm package. We'll walk you through that process below.

[[toc]]

## Publishing your own npm package

### The short version

1. [Follow this guide](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) to publish your code as an npm package. You can see [the code for an example package here](https://github.com/dylburger/pd), `@dylburger/pd`.
2. In any workflow, you can `import` code provided by your package.

```javascript
// import the random function from this example package
import { random } from "@dylburger/pd";
console.log(random());
```

### Step by step

This guide will walk you through how to create and publish an npm package. You can `import` the code from this package in any Pipedream workflow.

1. Open the [publishing guide](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) from npm. Follow steps 1 - 7.
2. Create an `index.js` file within your package's directory with the following contents:

```javascript
function random() {
  return Math.random();
}

// Read https://www.sitepoint.com/understanding-module-exports-exports-node-js/
// for more information on this syntax
export default {
  random,
};
```

The `random` function is just an example - you can keep this code or replace it with any function or code you'd like to use on Pipedream.

3. You'll need to publish a **public** package to use it on Pipedream. Make sure to [review your code for any sensitive information](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#reviewing-package-contents-for-sensitive-or-unnecessary-information).
4. Follow the instructions in the [Publishing scoped public packages section](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#publishing-scoped-public-packages) of the npm guide to publish your package to npm's registry.
5. In a Pipedream workflow, `import` the `random` function from the example, or run the other code provided by your package:

```javascript
// import the random function
import { random } from "@your-username/your-package";
console.log(random());
```

6. If you need to add more code to your package, add it to your `index.js` file, increment the `version` in your `package.json` file, and publish your package again.

<Footer />
