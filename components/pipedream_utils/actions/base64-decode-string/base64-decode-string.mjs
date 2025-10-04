// legacy_hash_id: a_0Mio28
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-base64-decode-string",
  name: "Helper Functions - Base64 Decode String",
  description: "Accepts a base64-encoded string, returns a decoded UTF-8 string",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    data: {
      type: "string",
    },
  },
  async run({ $ }) {
    const buffer = Buffer.from(this.data, "base64");
    $.export("data", buffer.toString("utf8"));
  },
};
