// legacy_hash_id: a_A6i7q8
import set from "lodash.set";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-prettify-json",
  name: "Helper Functions - Pretty Print JSON",
  description: "Pretty print a JavaScript object or value",
  version: "0.0.1",
  type: "action",
  props: {
    pipedream_utils,
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
