# Migrate from Pipedream v1

The newest version of the Pipedream introduces features like creating code steps in [Python](/code/python), [Bash](/code/bash) and [Go](/code/go) from within the workflow builder.

It also brings the [Node.js](/code/nodes) steps closer to our [Component API](/components/) which powers sources & actions in the platform.

But, this also means some of our features have changed, here's what you need to know.

## New Builder Overview

### New Patterns

### Testing Changes

### Deploying Changes

### Connecting apps

In the v2 builder, you can connect apps with your code using [props](/components/props).

Above the `run` function define an app prop that your Node.js step integrates with.

```
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

## Node.js Code Step Changes

### Steps Format Changes

In v1, the Node.js steps would automatically scaffold new steps in this format:

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

### using 3rd party packages changes

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


### Step Export changes

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

### Node.js Exit Flow Changes

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

### HTTPs Response

## Known Gaps & Limitations

* Sharing workflows

* `$checkpoint`

* Public workflows

* Versioned deployments and rollback



