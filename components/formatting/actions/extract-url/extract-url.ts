import { defineAction } from "@pipedream/types";
import commonExtractText from "../../common/text/commonExtractText";

export default defineAction({
  ...commonExtractText,
  name: "[Text] Extract URL",
  description:
    "Find a web URL out of a text field. Finds the first URL only.",
  key: "formatting-extract-url",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...commonExtractText.props,
    input: {
      label: "Input",
      description: "String from which you'd like to extract a URL",
      type: "string",
    },
  },
  methods: {
    ...commonExtractText.methods,
    getRegExp() {
      return /https?:\/\/[^\s]+\.[^\s]+/;
    },
    getType() {
      return "URL";
    },
  },
});
