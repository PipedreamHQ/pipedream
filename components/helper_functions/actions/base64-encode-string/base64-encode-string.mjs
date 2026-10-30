import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-base64-encode-string",
  name: "Base64 Encode String",
  description: "Accepts a string and returns its base64-encoded representation. The inverse of [Base64 Decode String](https://pipedream.com/apps/helper-functions/actions/base64-decode-string).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    helper_functions,
    data: {
      label: "Data",
      type: "string",
      description: "The string to encode.",
    },
    inputEncoding: {
      type: "string",
      label: "Input Encoding",
      description: "How to interpret the input string's characters as bytes. Use `utf8` for regular text, or `binary` (latin1) when each character represents a single raw byte.",
      options: [
        "utf8",
        "binary",
      ],
      default: "utf8",
      optional: true,
    },
  },
  async run({ $ }) {
    const encoded = Buffer.from(this.data, this.inputEncoding || "utf8").toString("base64");
    $.export("$summary", "Successfully base64-encoded string");
    return {
      encoded,
    };
  },
};
