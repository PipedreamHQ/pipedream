// legacy_hash_id: a_0Mio28
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-base64-decode-string",
  name: "Base64 Decode String",
  description: "Accepts a base64-encoded string, returns the decoded data as a UTF-8 string or raw binary",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helper_functions,
    data: {
      type: "string",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The format of the decoded output. Use `utf8` to return a decoded string, or `binary` to return the raw bytes (as a Buffer).",
      options: [
        "utf8",
        "binary",
      ],
      default: "utf8",
      optional: true,
    },
  },
  async run({ $ }) {
    const buffer = Buffer.from(this.data, "base64");
    const output = this.outputFormat === "binary"
      ? buffer
      : buffer.toString("utf8");
    $.export("data", output);
  },
};
