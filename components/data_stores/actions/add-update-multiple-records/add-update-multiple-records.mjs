import dataStores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-multiple-records",
  name: "Add or update multiple records",
  description: "Add or update multiple records to your Pipedream Data Store.",
  version: "0.0.1",
  type: "action",
  props: {
    dataStores,
    store: {
      label: "Data Store",
      type: "store",
      description: "Select an existing Data Store or create a new one.",
    },
    data: {
      label: "Data",
      type: "object",
      description: "Enter data you'd like to add in the form of key-value pairs, or reference existing keys and update the values for existing records.",
    },
  },
  async run({ $ }) {
    for (const [
      key,
      value,
    ] of Object.entries(this.data)) {
      this.store.set(key, value);
    }

    let count = Object.keys(this.data).length;
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully added or updated ${count} ${count == 1 ? "record" : "records"}`);
  },
};
