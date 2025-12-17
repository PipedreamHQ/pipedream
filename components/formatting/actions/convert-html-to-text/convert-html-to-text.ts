import { defineAction } from "@pipedream/types";
import { convert } from "html-to-text";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Convert HTML to text",
  description: "Convert valid HTML to text",
  key: "formatting-convert-html-to-text",
  version: "0.0.5",
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
      description: "HTML string to be converted to text",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const { input } = this;
    const result = convert(input);

    $.export("$summary", "Successfully converted to text");
    return result;
  },
});
