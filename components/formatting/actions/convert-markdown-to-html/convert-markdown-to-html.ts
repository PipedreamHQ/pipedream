import { defineAction } from "@pipedream/types";
import showdown from "showdown";
import jsdom from "jsdom";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Convert Markdown to HTML",
  description: "Convert Markdown text to HTML",
  key: "formatting-convert-markdown-to-html",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "Markdown string to be converted to HTML",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const { input } = this;
    const converter = new showdown.Converter();
    const dom = new jsdom.JSDOM();
    const result = converter.makeHtml(input, dom.window.document);

    $.export("$summary", "Sucessfully converted to HTML");
    return result;
  },
});
