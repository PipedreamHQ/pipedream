import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Set Default Value",
  description: "Return a default value if the text is empty",
  key: "pipedream_utils-set-default-value",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "Reference a previous step where you'd like to apply a default value in the case the field is empty or undefined. For example, `{{steps.code.$return_value.test}}`",
      type: "string",
    },
    defaultValue: {
      label: "Default Value",
      description: "Value to return if the text is empty",
      type: "string",
    },
  },
  async run({ $ }) {
    const {
      input, defaultValue,
    } = this;
    const result = input || defaultValue;
    $.export("$summary", input
      ? "Checked text - not empty"
      : "Replaced empty text with default value");
    return result;
  },
};
