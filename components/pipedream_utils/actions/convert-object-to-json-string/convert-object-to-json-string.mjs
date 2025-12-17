// legacy_hash_id: a_a4i80O
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-convert-object-to-json-string",
  name: "Helper Functions - Convert JavaScript Object to JSON String",
  description: "Accepts a JavaScript object, returns that object converted to a JSON string",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    object: {
      type: "string",
      description: "The JavaScript object you'd like to convert to a JSON string",
    },
  },
  async run() {
    return JSON.stringify(this.object);
  },
};
