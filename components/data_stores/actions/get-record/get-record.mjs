import dataStores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-record",
  name: "Get Record",
  description: "Get one record in your Pipedream Data Store.",
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
      description: "Key for the data you'd like to fetch.",
    },
  },
  async run({ $ }) {
    const record = this.store.get(this.key);

    if (record) {
      $.export("$summary", `Successfully fetched data for key "${this.key}".`);
    } else {
      $.export("$summary", `No data found for key "${this.key}"`);
    }

    return record;
  },
};
