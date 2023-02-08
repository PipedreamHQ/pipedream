import { defineAction } from "@pipedream/types";
import commonExtractText from "../../common/text/commonExtractText";

export default defineAction({
  ...commonExtractText,
  name: "[Text] Extract Email Address",
  description:
    "Find an email address out of a text field. Finds the first email address only.",
  key: "formatting-extract-email-address",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "Text you would like to find an email address from",
      type: "string",
    },
  },
  methods: {
    getRegExp() {
      return /[\w-.]+@([\w-]+\.)+[\w-]{2,}/;
    },
    getType() {
      return "email address";
    },
  },
});
