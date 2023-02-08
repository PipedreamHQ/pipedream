import { defineAction } from "@pipedream/types";
import commonExtractText from "../../common/text/commonExtractText";

export default defineAction({
  ...commonExtractText,
  name: "[Text] Extract Number",
  description:
    "Find a number out of a text field. Finds the first number only.",
  key: "formatting-extract-number",
  version: "0.0.1",
  type: "action",
  props: {
    ...commonExtractText.props,
    input: {
      label: "Input",
      description: "Text you would like to find a number from",
      type: "string",
    },
  },
  methods: {
    getRegExp() {
      return /[0-9][0-9.,]*/;
    },
    getType() {
      return "number";
    },
  },
});
