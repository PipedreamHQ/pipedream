import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Encode URL",
  description: "Encode a string as a URL",
  key: "pipedream_utils-url-encode",
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
      description: "A valid URL as a string to be encoded.",
      type: "string",
    },
  },
  async run({ $ }) {
    const result = encodeURIComponent(this.input);
    $.export("$summary", "Successfully encoded URL");
    return result;
  },
};
