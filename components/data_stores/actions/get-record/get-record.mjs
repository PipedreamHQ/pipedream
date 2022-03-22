import dataStores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-record",
  name: "Get Record",
  description: "Get a single record in your Pipedream Data Store.",
  version: "0.0.1",
  type: "action",
  props: {
    dataStores,
    store: {
      label: "Data Store",
      type: "data_store",
      description: "Select an existing Data Store or create a new one.",
    },
    key: {
      label: "Key",
      type: "string",
      description: "Key for the data you'd like to fetch. Refer to your existing keys [here](https://pipedream.com/stores).",
    },
  },
  async run({ $ }) {
    const record = this.data_store.get(this.key);

    if (record) {
      $.export("$summary", "Successfully fetched data for key, `" + this.key + "`.");
    } else {
      $.export("$summary", "No data found for key, `" + this.key + "`.");
    }

    return record;
  },
};
