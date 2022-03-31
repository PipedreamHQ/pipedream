// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-multiple-records",
  name: "Add or update multiple records",
  description: "Add or update multiple records to your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.2",
  type: "action",
  props: {
    data_stores,
    data_store: {
      propDefinition: [
        // eslint-disable-next-line camelcase
        data_stores,
        "data_store",
      ],
    },
    data: {
      label: "Data",
      type: "object",
      description: "Enter data you'd like to add as an object containing key-value pairs, or reference existing keys and update the values for those existing records. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
    },
  },
  async run({ $ }) {
    for (const [
      key,
      value,
    ] of Object.entries(this.data)) {
      this.data_store.set(key, value);
    }

    let count = Object.keys(this.data).length;

    if (count == 1) {
      $.export("$summary", "Successfully added or updated 1 record.");
    } else {
      $.export("$summary", "Successfully added or updated " + count + " records.");
    }
  },
};
