import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import {
  CASE_OPTIONS, CASE_OPTIONS_PROP,
} from "../../common/text/caseOptions";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Transform Case",
  description: "Transform case for a text input",
  key: "formatting-transform-case",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "The text you would like to transform",
      type: "string",
    },
    operation: {
      label: "Operation",
      description: "The case operation",
      type: "string",
      options: CASE_OPTIONS_PROP,
    },
  },
  async run({ $ }): Promise<string> {
    const {
      input, operation,
    } = this;

    try {
      const { outputFn } = CASE_OPTIONS.find(({ value }) => value === operation);

      const result = outputFn(input);

      $.export("$summary", "Successfully transformed text case");
      return result;
    } catch (err) {
      throw new ConfigurationError("**Parse error** - check your input and if the selected operation is correct.");
    }
  },
});
