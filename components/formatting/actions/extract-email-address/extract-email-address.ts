import { defineAction } from "@pipedream/types";
import commonExtractText from "../../common/text/commonExtractText";

export default defineAction({
  ...commonExtractText,
  name: "[Text] Extract Email Address",
  description:
    "Find an email address out of a text field. Finds the first email address only.",
  key: "formatting-extract-email-address",
  version: "0.0.7",
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
      description: "String from which you'd like to extract an email address",
      type: "string",
    },
  },
  methods: {
    ...commonExtractText.methods,
    getRegExp() {
      return /[\w.!#$%&'*+-/=?^_`{|}~]+@([\w-]+\.)+[\w-]{2,}/;
    },
    getType() {
      return "email address";
    },
  },
});
