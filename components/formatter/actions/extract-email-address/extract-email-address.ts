import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Text] Extract Email Address",
  description:
    "Find an email address out of a text field. Finds the first email address only.",
  key: "expofp-extract-email-address",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "Text you would like to find an email address from",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const input: string = this.input;
    const result = input.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,}/)?.[0];

    $.export(
      "$summary",
      result
        ? `Successfully found email address ${result}`
        : "No email address found"
    );
    return result;
  },
});
