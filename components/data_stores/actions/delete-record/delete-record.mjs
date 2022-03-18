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
      description: "Key for the data you'd like to delete.",
    },
  },
  async run({ $ }) {
    const record = this.store.get(this.key);

    if (record) {
      this.store.set(this.key, undefined);
      $.export("$summary", `Successfully deleted "${this.key}" key in the store. (Previous value: "${record}")`);
    } else {
      $.export("$summary", `No value for key "${this.key}" was previously stored. No data was deleted`);
    }
  },
};
