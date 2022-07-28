import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-delete-single-record",
  name: "Delete a single record",
  description: "Delete a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.7",
  type: "action",
  props: {
    app,
    dataStore: {
      propDefinition: [
        app,
        "dataStore",
      ],
    },
    key: {
      propDefinition: [
        app,
        "key",
        ({ dataStore }) => ({
          dataStore,
        }),
      ],
      description: "Select the key for the record you'd like to delete, or enter one manually.",
    },
  },
  async run({ $ }) {
    const record = await this.dataStore.get(this.key);

    if (record) {
      await this.dataStore.delete(this.key);
      $.export("$summary", `Successfully deleted the record for key, \`${this.key}\`.`);
      return record;
    }

    $.export("$summary", `No record found for key, \`${this.key}\`. No data was deleted.`);
  },
};
