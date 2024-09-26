props = """## Props

The component must contain a `props` property. Props lets the user pass data to the step via a form in the Pipedream UI, so they can fill in the values of the variables.

For example:

export default {
  ...
  props: {
    slack: {
      type: "app",
      app: "slack",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel to post the message to",
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to post",
    },
  },
};

### Naming conventions are critical

If the instructions say to use a particular prop name, you must use that for the prop key in the `props` object. For example, if the instructions say to use `propName`, you must use `propName`, not `prop_name` or `propname`.

### Required props

You MUST include any required parameters of the API requests in the component as properties of the `props` object. In the example above, `channel` and `text` are required parameters of the Slack API request, so they are included as props.

Add these at the top of the `props` object, so it's easier for me to identify them.

### Additional rules

Props must include a human-readable `label` and a `type` (one of string|boolean|integer|object) that corresponds to the Node.js type of the required param. 

string, boolean, and integer props allow for arrays of input, and the array types are "string[]", "boolean[]", and "integer[]" respectively. 

Complex props (like arrays of objects) can be passed as string[] props, and each item of the array can be parsed as JSON. If the user asks you to provide an array of object, ALWAYS provide a `type` of string[]. 

export default {
  ...
  props: {
    complexProp: {
      type: "string[]",
      label: "Complex Prop",
      description: "An array of objects",
    }
  },
  run() {
    const complexProp = this.complexProp.map(JSON.parse);
    // complexProp is now an array of objects
  }
};

Optionally, props can have a human-readable `description` describing the param. 

### Optional props

DO NOT INCLUDE optional API parameters as props, unless specified in the instructions.

Optional parameters that correspond to the test code should be declared with `optional: true`. Recall that props may contain an `options` method.

export default {
  ...
  props: {
    optionalProp: {
      type: "string",
      label: "Optional Prop",
      description: "An optional prop",
      optional: true,
    },
  },
};

`optional: false` is the default, so you don't need to include it for required props.

Within the component's run method, the `this` variable refers to properties of the component. All props are exposed at `this.<name of the key in the props object>`. e.g. `this.input`. `this` doesn't contain any other properties.

export default {
  ...
  props: {
    input: {
      type: "string",
      label: "Input",
      description: "An input",
    },
  },
  run() {
    console.log(this.input);
  }
};
"""
