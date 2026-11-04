import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-base64-encode-string",
  name: "Base64 Encode String",
  description: "Accepts a string and returns its base64-encoded representation. The inverse of **Base64 Decode String**.",
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
      description: "The string to encode, e.g. `hello`.",
    },
    inputEncoding: {
      type: "string",
      label: "Input Encoding",
      description: "How to interpret the input string's characters as bytes. Use `utf8` for regular text, or `binary` (latin1) when each character represents a single raw byte (characters above U+00FF are truncated to their low byte). e.g. `utf8`.",
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
