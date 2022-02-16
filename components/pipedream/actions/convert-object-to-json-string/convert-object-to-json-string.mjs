// legacy_hash_id: a_a4i80O
export default {
  key: "pipedream-convert-object-to-json-string",
  name: "Convert JavaScript Object to JSON String",
  description: "Accepts a JavaScript object, returns that object converted to a JSON string",
  version: "0.1.1",
  type: "action",
  props: {
    pipedream: {
      type: "app",
      app: "pipedream",
    },
    object: {
      type: "string",
      description: "The JavaScript object you'd like to convert to a JSON string",
    },
  },
  async run() {
    return JSON.stringify(this.object);
  },
};
