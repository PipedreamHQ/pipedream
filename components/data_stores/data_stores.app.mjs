import xss from "xss";

/**
 * Should support the following data types:
 * https://pipedream.com/docs/data-stores/#supported-data-types
 */

export default {
  type: "app",
  app: "data_stores",
  propDefinitions: {
    dataStore: {
      label: "Data Store",
      type: "data_store",
      description: "Select an existing Data Store or create a new one.",
    },
    key: {
      label: "Key",
      type: "string",
      description: "Key for the data you'd like to add or update. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
      async options({ dataStore }) {
        return dataStore.keys();
      },
    },
    value: {
      label: "Value",
      type: "any",
      description: "Enter a string, object, or array.",
    },
    addRecordIfNotFound: {
      label: "Create a new record if the key is not found?",
      description: "Create a new record if no records are found for the specified key.",
      type: "string",
      options: [
        "Yes",
        "No",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  methods: {
    // using Function approach instead of eval:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
    evaluate(value) {
      try {
        return Function(`"use strict"; return (${xss(value)})`)();
      } catch (err) {
        return value;
      }
    },
    parseJSON(value) {
      return JSON.parse(JSON.stringify(this.evaluate(value)));
    },
    shouldAddRecord(option) {
      return option === "Yes";
    },
    parseValue(value) {
      if (typeof value !== "string") {
        return value;
      }

      try {
        return this.parseJSON(value);
      } catch (err) {
        return value;
      }
    },
  },
};
