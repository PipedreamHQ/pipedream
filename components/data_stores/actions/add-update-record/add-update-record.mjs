import dataStores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-single-record",
  name: "Add or update a single record",
  description: "Add or update a single record in your Pipedream Data Store.",
  version: "0.0.2",
  type: "action",
  props: {
    dataStores,
    store: {
      label: "Data Store",
      type: "store",
      description: "Select an existing Data Store or create a new one.",
    },
    key: {
      label: "Key",
      type: "string",
      description: "Key for the data you'd like to add or update.",
    },
    value: {
      label: "Value",
      type: "string",
      description: "Value you'd like to add or update.",
    },
  },
  async run({ $ }) {
    const hasRegister = this.store.get(this.key);
    this.store.set(this.key, this.value);

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully ${hasRegister ? "edited" : "added"} "${this.key}" key in the store`);
  },
};
