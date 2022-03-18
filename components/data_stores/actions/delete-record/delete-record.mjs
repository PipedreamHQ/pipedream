import dataStores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-delete-record",
  name: "Delete a single record",
  description: "Delete a single record in your Pipedream Data Store.",
  version: "0.0.3",
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
      description: "Key for the data you'd like to delete. Refer to your existing keys [here](https://pipedream.com/stores).",
    },
  },
  async run({ $ }) {
    const record = this.store.get(this.key);

    if (record) {
      this.store.set(this.key, undefined);
      $.export("$summary", "Successfully deleted the record for key, `" + this.key + "`.");
    } else {
      $.export("$summary", "No record found for key, `" + this.key + "`. No data was deleted.");
    }
  },
};
