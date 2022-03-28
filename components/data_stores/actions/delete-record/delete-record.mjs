// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-delete-record",
  name: "Delete a single record",
  description: "Delete a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.3",
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
      description: "Key for the data you'd like to delete. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
    },
  },
  async run({ $ }) {
    const record = this.data_store.get(this.key);

    if (record) {
      this.data_store.set(this.key, undefined);
      $.export("$summary", "Successfully deleted the record for key, `" + this.key + "`.");
    } else {
      $.export("$summary", "No record found for key, `" + this.key + "`. No data was deleted.");
    }
  },
};
