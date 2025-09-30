import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Data] Parse JSON",
  description: "Parse a JSON string",
  key: "pipedream_utils-parse-json",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "A valid JSON format string to be parsed.",
      type: "string",
    },
  },
  async run({ $ }) {
    try {
      const result = JSON.parse(this.input);
      $.export("$summary", "Successfully parsed JSON string");
      return result;
    }
    catch (err) {
      throw new Error("Error parsing input as JSON: " + err.toString());
    }
  },
};
