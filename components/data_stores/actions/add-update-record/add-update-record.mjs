import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-record",
  name: "Add or update a single record",
  description: "Add or update a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
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
      description: "Enter a key for the record you'd like to create or select an existing key to update.",
    },
    value: {
      label: "Value",
      type: "any",
      description: "Enter a string, object, or array.",
    },
  },
  async run({ $ }) {
    const {
      key,
      value,
    } = this;
    const record = await this.dataStore.get(key);
    const parsedValue = this.app.parseValue(value);
    await this.dataStore.set(key, parsedValue);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully ${record ? "updated the record for" : "added a new record with the"} key, \`${key}\`.`);
    return {
      key,
      value,
    };
  },
};
