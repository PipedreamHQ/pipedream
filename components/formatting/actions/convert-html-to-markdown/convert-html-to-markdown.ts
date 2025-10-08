import { defineAction } from "@pipedream/types";
import { parseHTML } from "linkedom";
import showdown from "showdown";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Convert HTML to Markdown",
  description: "Convert valid HTML to Markdown text",
  key: "formatting-convert-html-to-markdown",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "HTML string to be converted to Markdown",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const { input } = this;
    const converter = new showdown.Converter();
    const dom = parseHTML("");
    const result = converter.makeMarkdown(input, dom.window.document);

    $.export("$summary", "Successfully converted to Markdown");
    return result;
  },
});
