# Migrate from Pipedream v1

The newest version of the Pipedream introduces features like creating code steps in [Python](/code/python), [Bash](/code/bash) and [Go](/code/go) from within the workflow builder.

It also brings the [Node.js](/code/nodes) steps closer to our [Component API](/components/) which powers sources & actions in the platform.

But, this also means some of our features have changed, here's what you need to know.

## New Builder Overview

Fundamentally, the new version of the workflow builder gives you the same abilities to build, test and deploy your workflows. However, there are some differences that change up your normal flow.

### Editing vs Inspecting

Now, editing a workflow are separated from the viewing of production events and results on the deployed workflow.

When you first open a deployed workflow, you're presented with the **inspector** version of the workflow. In this view you can see logs of past events, and select them to see the results of each step in the workflow.

To edit the workflow, click the **Edit** button in the top right hand corner. This will close the inspector and allow you to edit your workflow.

### Testing Changes

In the v1 workflow builder to test changes to individual steps required saving then deploying each change to run a test.

We've improved this flow. You can test your changes with a new **Test** button.

In addition to testing single steps, you can now selectively test portions of your workflow in isolation.

<img src="./images/test-workflow-portions.png" alt="Selectively pick testing your workflow above or below the current step is now available.">

Now you can also choose to only test steps up to a certain step, or after a current step.

### Deploying Changes

After you're happy with your changes, you can **deploy** them to your production workflow. Just click the **Deploy** button in the top right hand corner of the screen.

After deploying your changes, your workflow is now live.


## Node.js Code Step Changes

There are a few changes to the Node.js code steps that you should know about. Some functions have been renamed for more clarity, and we've aligned the Node.js code steps closer to the [Component API](/docs/components/).

### Code Scaffolding Format

In v1, the Node.js steps would automatically scaffold new Node.js steps in this format:

```javascript
async (event, steps) {
  // your code could be entered in here
}
```

In v2, the new scaffolding is wrapped with a new `defineComponent` function:

```javascript
defineComponent({
  async run({ steps, $ }) {
    // your code can be entered here
  }
});
```

1. The `event` from the trigger step is still available, but within `steps.trigger.event` instead.
2. The `$` variable has been passed into the `run` function where your code is executed.

### using 3rd party packages

In v1, you had to define your imports of 3rd party packages within the scaffolded function:

```javascript
async (event, steps) {
  const axios = require('axios');
  // your code could be entered in here
}
```

Now, in v2 workflows you can `import` your packages in the top of the step, just like a normal Node.js module:

```javascript
import axios from 'axios';

defineComponent({
  async run({ steps, $ }) {
    // your code can be entered here
  }
});
```

Allowing all of the scaffolding to be edited opens up the ability to [pass props](code/nodejs/#passing-props-to-code-steps) into your Node.js code steps.


### Step Exports 

In v1, you could assign arbitrary properties to `this` within a Node.js step and the properties would be available as step exports:

```javascript
// this step's name is get_customer_data
async (event, steps) {
  this.name = 'Dylan';
  // downstream steps could use steps.get_customer_data.name to retrieve 'Dylan'
}
```

In v2, this specific way of exporting data is now available with `$.export`:

```javascript
// this step's name is get_customer_data
defineComponent({
  async run({ steps, $ }) {
    $.export('name', 'Dylan');
    // downstream steps can use steps.get_customer_data.name to retrieve 'Dylan'
  }
});
```
::: tip
Using `return` to export data from steps has not been changed from v1 to v2. You can still `return` data, and it will be available to other steps with `steps.[stepName].$return_value.
:::

### Exiting a workflow early 

In v1, the `$exit` function can be called to exit a flow early:

```javascript
async (event, steps) {
  exit('Exiting the whole workflow early');
  console.log('I will never run');
}
```

In v2, this same function is available, but under `$.exit`:

```javascript
defineComponent({
  async run({ steps, $ }) {
    $.flow.exit('Exiting the workflow early');
    console.log('I will never run');
  }
});
```

::: warning
In v2, `$end` does not display the reason in the workflow results logs.
::: 

### Params vs Props

In workflow builder v2, both Component **props** and Node.js code steps **props** are one in the same.

You can still enter free text and select data from other steps in pre-built actions. Also can add your own custom props that accept input like strings, numbers and more just like in v1.

#### Defining params

In the v1 workflow builder, params could be structured or unstructured. And you had to use the [params schema builder](https://pipedream.com/docs/v1/workflows/steps/params/#configuring-custom-params) to add your own custom params.

In v2, you can add your own custom props without leaving the code editor.

```javascript
export default defineComponent({
  props: {
    firstName: {
      type: 'string',
      label: 'Your first name',
    }
  },
  async run({ steps, $ }) {
    console.log(this.firstName);
  }
});

```

In the example above a `firstName` string prop is created. The value assigned to this prop in the workflow builder by either a static string or dynamic data will be available in the step as `this.firstName`.

Additionally, a visual component is rendered in the step **Configuration** to accept this input:

<img src="./images/custom-string-prop.png" alt="Custom props render in the Configuration portion of the code step.">

### Connecting apps

In the v2 builder, you can connect apps with your code using [props](/components/props).

Above the `run` function define an app prop that your Node.js step integrates with.

```javascript
export default defineComponent({
  props: {
    twitter: {
      type: "app",
      app: "slack",
    }
  },
  async run({ steps, $ }) {
    // now your Slack token for authenticating API calls will be available here:
    this.slack.$auth.oauth_access_token;
  },
})
```

After testing the step the Slack app will appear in the **Configuration** section on the left hand side. In this section you can choose which Slack account you'd like to use in the step.

<img src="./images/app-props-example.png" alt="Example of adding an app connection to a v2 Node.js step">


### HTTPs Response

You can still return an HTTP response from an HTTP triggered workflow.

Use `$.respond` to send a JSON or string response from the HTTP call that triggered the workflow.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    $.respond({
      status: 200,
      headers: {},
      body: { 
        message: "hello world!"
      }
    });
  },
})
```

Please note, you'll also need to configure the HTTP trigger step to also allow custom responses. Use the dropdown in the **HTTP Response** section of the HTTP trigger to select the **Return a custom response from your workflow** option.

<img src="./images/custom-http-response-option.png" alt="Select the option to allow your workflow to send it's own HTTP responses">

## Known Gaps & Limitations

The new workflow builder introduces new features that weren't available in v1. However there are some features from the original builder that are not available in v2 currently.

### Sharing workflows

At this time, sharing is not yet implemented in v2 of the workflow builder.

We're working on bringing this same feature to the new version, if you need assistance transferring workflows across accounts, [please contact us](/docs/support).

### `$checkpoint`

The `$checkpoint` functionality to save data between workflow runs has been removed.

But you can leverage the `$.database` service to store arbitrary data across your workflow runs like unique IDs.

::: warning
Please note that any values stored in `$.database` are only accessible in subsequent workflow runs _in the same step_.
:::

### Public workflows

At this time, all v2 workflows are private.

Unlike v1, it's not possible to make a workflow public. We can still help support your workflow, you just need to share it with us under the workflow settings.

### Versioned deployments and rollback

In v2, you can test and save your progress on a workflow _without_ deploying it.

However, after deploying it's not possible to rollback to a prior version.




