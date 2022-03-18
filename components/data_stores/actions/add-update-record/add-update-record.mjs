import dataStores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-record",
  name: "Add or update a single record",
  description: "Add or update a single record in your Pipedream Data Store.",
  version: "0.0.1",
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
      description: "Key for the data you'd like to add or update. Refer to your existing keys [here](https://pipedream.com/stores).",
    },
    value: {
      label: "Value",
      type: "string",
      description: "Value you'd like to add or update.",
    },
  },
  async run({ $ }) {
    const record = this.store.get(this.key);
    this.store.set(this.key, this.value);

    if (record) {
      $.export("$summary", "Successfully updated the record for key, `" + this.key + "`.");
    } else {
      $.export("$summary", "Successfully added a new record with the key, `" + this.key + "`.");
    }
  },
};
