import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Text] Trim Whitespace",
  description: "Removes leading and trailing whitespace",
  key: "expofp-trim-whitespace",
  version: "0.0.1",
  type: "action",
  props: {
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

    $.export("$summary", "Sucessfully trimmed text");
    return result;
  },
});
