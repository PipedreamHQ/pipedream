import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Text] Default Value",
  description: "Return a default value if the text is empty",
  key: "expofp-default-value",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description:
        "Text you would like to apply a default value, if it is empty",
      type: "string",
    },
    defaultValue: {
      label: "Default Value",
      description: "Value to return if the text is empty",
      type: "string",
    },
  },
  async run({ $ }): Promise<string> {
    const { input, defaultValue } = this;

    const result = input || defaultValue;

    $.export(
      "$summary",
      input
        ? "Checked text - not empty"
        : "Replaced empty text with default value"
    );
    return result;
  },
});
