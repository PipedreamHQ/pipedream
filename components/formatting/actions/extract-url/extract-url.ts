import { defineAction } from "@pipedream/types";
import commonExtractText from "../../common/text/commonExtractText";

export default defineAction({
  ...commonExtractText,
  name: "[Text] Extract URL",
  description:
    "Find a web URL out of a text field. Finds the first URL only.",
  key: "formatting-extract-url",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "Text you would like to find a web URL from",
      type: "string",
    },
  },
  methods: {
    getRegExp() {
      return /https?:\/\/[^\s]+\.[^\s]+/;
    },
    getType() {
      return "URL";
    },
  },
});
