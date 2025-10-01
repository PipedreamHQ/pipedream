import node from "../../node.app.mjs";

export default {
  name: "Run Node Code",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "node-run-node-code",
  description: "Write custom Node.js code and use any of the 400k+ npm packages available. Refer to the [Pipedream Node docs](https://pipedream.com/docs/code/nodejs) to learn more.",
  props: {
    node,
  },
  type: "action",
  methods: {},
  async run({
    steps, $,
  }) {
    // Return data to use it in future steps
    return steps.trigger.event;
  },
};
