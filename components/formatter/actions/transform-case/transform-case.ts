import { defineAction } from "@pipedream/types";
import { CASE_OPTIONS } from "../../common/text/caseOptions";

export default defineAction({
  name: "[Text] Transform Case",
  description: "Transform case for a text input",
  key: "formatting-transform-case",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "The text you would like to transform",
      type: "string",
    },
    operation: {
      label: "Operation",
      description: "The case operation",
      type: "string",
      options: CASE_OPTIONS.map(({
        label, value,
      }) => ({
        label,
        value,
      })),
    },
  },
  async run({ $ }): Promise<string> {
    const {
      input, operation,
    } = this;

    const { outputFn } = CASE_OPTIONS.find(({ value }) => value === operation);

    const result = outputFn(input);

    $.export("$summary", "Successfully transformed text case");
    return result;
  },
});
