import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-has-key-or-create",
  name: "Check for existence of key",
  description: "Check if a key exists in your [Pipedream Data Store](https://pipedream.com/data-stores/) or create one if it doesn't exist.",
  version: "0.0.3",
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
      description: "Enter the key you'd like to check.",
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
  async run ({ $ }) {
    if (await this.dataStore.has(this.key)) {
      $.export("$summary", `Key "${this.key}" exists.`);
      return true;
    }

    if (this.app.shouldAddRecord(this.addRecordIfNotFound)) {
      const parsedValue = this.app.parseValue(this.value);
      await this.dataStore.set(this.key, parsedValue);
      $.export("$summary", `Key "${this.key}" was not found. Successfully added a new record.`);
      return this.dataStore.get(this.key);
    }

    $.export("$summary", `Key "${this.key}" does not exist.`);
    return false;
  },
};
