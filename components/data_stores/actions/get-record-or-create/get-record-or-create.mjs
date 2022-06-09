import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-record-or-create",
  name: "Get record (or create one if not found)",
  description: "Get a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/) or create one if it doesn't exist.",
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
      description: "Select the key for the data you'd like to retrieve, or enter one manually.",
    },
    addRecordIfNotFound: {
      propDefinition: [
        app,
        "addRecordIfNotFound",
      ],
    },
  },
  async additionalProps() {
    if (this.app.shouldAddRecord(this.addRecordIfNotFound)) {
      return this.app.valueProp();
    }
    return {};
  },
  async run({ $ }) {
    const record = await this.dataStore.get(this.key);

    if (record) {
      $.export("$summary", "Found data for the key, `" + this.key + "`.");
    } else {
      if (this.app.shouldAddRecord(this.addRecordIfNotFound)) {
        const parsedValue = this.app.parseValue(this.value);
        await this.dataStore.set(this.key, parsedValue);
        $.export("$summary", "Successfully added a new record with the key, `" + this.key + "`.");
        return this.dataStore.get(this.key);
      } else {
        $.export("$summary", "No data found for key, `" + this.key + "`.");
      }
    }

    return record;
  },
};
