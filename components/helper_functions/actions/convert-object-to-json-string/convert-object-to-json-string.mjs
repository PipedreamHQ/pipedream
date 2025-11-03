// legacy_hash_id: a_a4i80O
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-convert-object-to-json-string",
  name: "Convert JavaScript Object to JSON String",
  description: "Accepts a JavaScript object, returns that object converted to a JSON string",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helper_functions,
    object: {
      type: "string",
      description: "The JavaScript object you'd like to convert to a JSON string",
    },
  },
  async run() {
    return JSON.stringify(this.object);
  },
};
