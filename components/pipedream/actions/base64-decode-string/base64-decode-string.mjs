// legacy_hash_id: a_0Mio28
export default {
  key: "pipedream-base64-decode-string",
  name: "Base64 Decode String",
  description: "Accepts a base64-encoded string, returns a decoded UTF-8 string",
  version: "0.1.1",
  type: "action",
  props: {
    pipedream: {
      type: "app",
      app: "pipedream",
    },
    data: {
      type: "string",
    },
  },
  async run({ $ }) {
    const buffer = Buffer.from(this.data, "base64");
    $.export("data", buffer.toString("utf8"));
  },
};
