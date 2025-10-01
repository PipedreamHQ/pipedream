import { ConfigurationError } from "@pipedream/platform";
import {
  CASE_OPTIONS, CASE_OPTIONS_PROP,
} from "../../common/text/caseOptions.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Transform Case",
  description: "Transform case for a text input",
  key: "pipedream_utils-transform-case",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
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
  async run({ $ }) {
    const {
      input, operation,
    } = this;
    try {
      const { outputFn } = CASE_OPTIONS.find(({ value }) => value === operation);
      const result = outputFn(input);
      $.export("$summary", "Successfully transformed text case");
      return result;
    }
    catch (err) {
      throw new ConfigurationError("**Parse error** - check your input and if the selected operation is correct.");
    }
  },
};
