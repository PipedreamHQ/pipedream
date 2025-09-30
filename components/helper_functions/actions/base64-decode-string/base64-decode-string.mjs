// legacy_hash_id: a_0Mio28
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-base64-decode-string",
  name: "Base64 Decode String",
  description: "Accepts a base64-encoded string, returns a decoded UTF-8 string",
  version: "0.1.2",
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
  },
  async run({ $ }) {
    const buffer = Buffer.from(this.data, "base64");
    $.export("data", buffer.toString("utf8"));
  },
};
