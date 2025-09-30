import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Trim Whitespace",
  description: "Removes leading and trailing whitespace",
  key: "pipedream_utils-trim-whitespace",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "Text you would like remove leading and trailing whitespace from.",
      type: "string",
    },
  },
  async run({ $ }) {
    const { input } = this;
    const result = input.trim();
    $.export("$summary", "Successfully trimmed text");
    return result;
  },
};
