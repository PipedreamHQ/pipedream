import helperFunctionsApp from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-export-variables",
  name: "Export Variables",
  description: "Export variables for use in your workflow",
  version: "0.0.1",
  type: "action",
  props: {
    helperFunctionsApp,
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
