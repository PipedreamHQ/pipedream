import { convert } from "html-to-text";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Convert HTML to text",
  description: "Convert valid HTML to text",
  key: "pipedream_utils-convert-html-to-text",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "HTML string to be converted to text",
      type: "string",
    },
  },
  async run({ $ }) {
    const { input } = this;
    const result = convert(input);
    $.export("$summary", "Successfully converted to text");
    return result;
  },
};
