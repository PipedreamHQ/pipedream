// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";

export default {
  key: "set-value",
  name: "Set a Value",
  description: "Store data in your Pipedream Data Store.",
  version: "0.0.1",
  type: "action",
  props: {
    data_stores,
    store: {
      label: "Data Store",
      type: "store",
      description: "Select an existing Data Store or create a new one.",
    },
    key: {
      label: "Key",
      type: "string",
      description: "Set a key for the data you'd like to store.",
    },
    value: {
      label: "Value",
      type: "string",
      description: "Set the value you'd like to store.",
    },
  },
  async run({ $ }) {
    const resp = this.store.set(this.key, this.value);
    $.export("$summary", "Successfully added or updated the key, `" + this.key + "`.");
    return resp;
  },
};
