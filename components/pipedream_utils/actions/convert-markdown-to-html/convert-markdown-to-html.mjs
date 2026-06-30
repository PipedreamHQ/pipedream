import { marked } from "marked";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Convert Markdown to HTML",
  description: "Convert Markdown text to HTML",
  key: "pipedream_utils-convert-markdown-to-html",
  version: "0.0.8",
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
      description: "Markdown string to be converted to HTML",
      type: "string",
    },
  },
  async run({ $ }) {
    const result = marked.parse(this.input);
    $.export("$summary", "Successfully converted to HTML");
    return result;
  },
};
