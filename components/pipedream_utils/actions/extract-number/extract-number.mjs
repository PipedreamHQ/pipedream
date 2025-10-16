import commonExtractText from "../../common/text/commonExtractText.mjs";
export default {
  ...commonExtractText,
  name: "Formatting - [Text] Extract Number",
  description: "Find a number out of a text field. Finds the first number only.",
  key: "pipedream_utils-extract-number",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...commonExtractText.props,
    input: {
      label: "Input",
      description: "String from which you'd like to extract a number",
      type: "string",
    },
  },
  methods: {
    ...commonExtractText.methods,
    getRegExp() {
      return /[0-9][0-9.,]*/;
    },
    getType() {
      return "number";
    },
  },
};
