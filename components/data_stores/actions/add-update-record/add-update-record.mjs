// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-record",
  name: "Add or update a single record",
  description: "Add or update a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
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
    key: {
      label: "Key",
      type: "string",
      description: "Key for the data you'd like to add or update. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
    },
    value: {
      label: "Value",
      type: "any",
      description: "Enter a string, object, or array.",
    },
  },
  async run({ $ }) {
    const record = this.data_store.get(this.key);
    this.data_store.set(this.key, this.value);

    if (record) {
      $.export("$summary", "Successfully updated the record for key, `" + this.key + "`.");
    } else {
      $.export("$summary", "Successfully added a new record with the key, `" + this.key + "`.");
    }
  },
};
