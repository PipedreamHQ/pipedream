export default {
  key: "helper_functions-variables-config",
  name: "Variables",
  description: "Configure variables for use in your workflow",
  version: "0.0.1",
  type: "action",
  props: {
    config: {
      type: "object",
      label: "Configuration",
      description: "Enter key-value pairs that you'd like to reference throughout your workflow.",
    },
  },
  run({ $ }) {
    $.export("config", this.config);
  },
};
