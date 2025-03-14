import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Decode URL",
  description: "Decode a URL string",
  key: "formatting-url-decode",
  version: "0.0.5",
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "A valid URL as a string to be decoded.",
      type: "string",
    },
  },
  async run({ $ }) {
    const result = decodeURIComponent(this.input);
    $.export("$summary", "Successfully decoded URL");
    return result;
  },
};
