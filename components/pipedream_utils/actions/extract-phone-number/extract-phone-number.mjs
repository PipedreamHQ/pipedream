import commonExtractText from "../../common/text/commonExtractText.mjs";
export default {
  ...commonExtractText,
  name: "Formatting - [Text] Extract Phone Number",
  description: "Find a complete phone number out of a text field. Finds the first number only.",
  key: "pipedream_utils-extract-phone-number",
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
      description: "String from which you'd like to extract a phone number",
      type: "string",
    },
    format: {
      label: "Phone Number Format",
      description: "Choose a phone number format, or use a custom string representing a [Regular Expression](https://www.w3schools.com/js/js_regexp.asp) (without the forward slashes)",
      type: "string",
      options: [
        {
          label: "North American Number Plan (NANP) e.g. `(123) 456-7890` or `123-456-7890`",
          value: "((\\([0-9]{3}\\) ?)|[0-9]{3}-)[0-9]{3}-[0-9]{4}",
        },
        {
          label: "International e.g. `(12) 34-56-78-90`",
          value: "\\([0-9]{2}\\) ?([0-9]{2}-){3}[0-9]{2}",
        },
      ],
    },
  },
  methods: {
    ...commonExtractText.methods,
    getRegExp() {
      return new RegExp(this.format);
    },
    getType() {
      return "phone number";
    },
  },
};
