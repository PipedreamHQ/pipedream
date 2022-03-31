export default {
  type: "app",
  app: "end",
  propDefinitions: {
    // eslint-disable-next-line pipedream/props-label
    reason: {
      label: "Reason",
      type: "string",
      description: "Enter the reason why the workflow is ending (e.g., \"No record found for user.\")",
      optional: true,
    },
    condition: {
      type: "boolean",
      label: "Condition",
      description: "Enter any expression (e.g., `{{ 2*2 === 4 }}`). If it evaluates to `true`, end workflow. Otherwise, continue.",
      optional: true,
      default: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
