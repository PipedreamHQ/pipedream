import { ConfigurationError } from "@pipedream/platform";
import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-export-variables",
  name: "Export Variables",
  description: "Export variables for use in your workflow",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helperFunctions,
    config: {
      type: "object",
      label: "Configuration",
      description: "Enter key-value pairs that you'd like to reference throughout your workflow.",
    },
  },
  methods: {
    emptyStrToUndefined(value) {
      const trimmed = typeof(value) === "string" && value.trim();
      return trimmed === ""
        ? undefined
        : value;
    },
    parse(value) {
      const valueToParse = this.emptyStrToUndefined(value);
      if (typeof(valueToParse) === "object" || valueToParse === undefined) {
        return valueToParse;
      }
      try {
        return JSON.parse(valueToParse);
      } catch (e) {
        throw new ConfigurationError("Make sure the custom expression contains a valid object");
      }
    },
  },
  run({ $ }) {
    $.export("config", this.parse(this.config));
  },
};
