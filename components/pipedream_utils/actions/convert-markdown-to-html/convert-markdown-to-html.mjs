import showdown from "showdown";
import { parseHTML } from "linkedom";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Convert Markdown to HTML",
  description: "Convert Markdown text to HTML",
  key: "pipedream_utils-convert-markdown-to-html",
  version: "0.0.7",
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
    const { input } = this;
    const converter = new showdown.Converter();
    const dom = parseHTML("");
    const result = converter.makeHtml(input, dom.window.document);
    $.export("$summary", "Successfully converted to HTML");
    return result;
  },
};
