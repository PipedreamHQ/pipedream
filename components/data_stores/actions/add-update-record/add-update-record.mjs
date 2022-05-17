import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-record",
  name: "Add or update a single record",
  description: "Add or update a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.5",
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
    let parsedValue;
    if (typeof value !== "string") {
      parsedValue = value;
    } else {
      try {
        let json = this.app.sanitizeJson(value);
        parsedValue = JSON.parse(json);
      } catch (err) {
        parsedValue = value;
      }
    }
    await this.dataStore.set(key, parsedValue);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully ${record ? "updated the record for" : "added a new record with the"} key, \`${key}\`.`);
    return {
      key,
      value,
    };
  },
};
