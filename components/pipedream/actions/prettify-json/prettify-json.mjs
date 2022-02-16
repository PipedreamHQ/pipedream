// legacy_hash_id: a_A6i7q8
import set from "lodash.set";

export default {
  key: "pipedream-prettify-json",
  name: "Pretty Print JSON",
  description: "Pretty print a JavaScript object or value",
  version: "0.1.1",
  type: "action",
  props: {
    pipedream: {
      type: "app",
      app: "pipedream",
    },
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
