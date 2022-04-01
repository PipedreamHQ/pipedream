// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-record",
  name: "Add or update a single record",
  description: "Add or update a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
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
      description: "Key for the data you'd like to add or update. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
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
    const record = this.data_store.get(key);
    let parsedValue;
    if (typeof value !== "string") {
      parsedValue = value;
    } else {
      try {
        let json = this.data_stores.sanitizeJson(value);
        parsedValue = JSON.parse(json);
      } catch (err) {
        parsedValue = value;
      }
    }
    this.data_store.set(key, parsedValue);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully ${record ? "updated the record for" : "added a new record with the"} key, \`${key}\`.`);
    return {
      key,
      value,
    };
  },
};
