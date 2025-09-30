// legacy_hash_id: a_A6i7q8
import set from "lodash.set";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-prettify-json",
  name: "Pretty Print JSON",
  description: "Pretty print a JavaScript object or value",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helper_functions,
    val: {
      type: "string",
      label: "Value",
      description: "The value to prettify",
    },
  },
  async run() {
    set(this, "prettifiedValue.val", JSON.stringify(this.val, null, 2));
  },
};
