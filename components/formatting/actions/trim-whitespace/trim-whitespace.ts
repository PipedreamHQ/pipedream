import { defineAction } from "@pipedream/types";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Trim Whitespace",
  description: "Removes leading and trailing whitespace",
  key: "formatting-trim-whitespace",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description:
        "Text you would like remove leading and trailing whitespace from.",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const { input } = this;
    const result = input.trim();

    $.export("$summary", "Successfully trimmed text");
    return result;
  },
});
