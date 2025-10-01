import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Data] Convert JSON to String",
  description: "Convert an object to a JSON format string",
  key: "pipedream_utils-convert-json-to-string",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "An object to be serialized to a JSON format string.",
      type: "object",
    },
  },
  async run({ $ }) {
    try {
      const result = JSON.stringify(this.input);
      $.export("$summary", "Successfully convert object to JSON string");
      return result;
    }
    catch (err) {
      throw new Error("Error serializing object to JSON string: " + err.toString());
    }
  },
};
