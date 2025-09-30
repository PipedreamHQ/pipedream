import { parseHTML } from "linkedom";
import showdown from "showdown";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Convert HTML to Markdown",
  description: "Convert valid HTML to Markdown text",
  key: "pipedream_utils-convert-html-to-markdown",
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
      description: "HTML string to be converted to Markdown",
      type: "string",
    },
  },
  async run({ $ }) {
    const { input } = this;
    const converter = new showdown.Converter();
    const dom = parseHTML("");
    const result = converter.makeMarkdown(input, dom.window.document);
    $.export("$summary", "Successfully converted to Markdown");
    return result;
  },
};
