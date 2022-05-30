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
    shouldAddRecord(option) {
      return option === "Yes";
    },
    valueProp() {
      return {
        value: {
          label: "Value",
          type: "any",
          description: "Enter a string, object, or array.",
        },
      };
    },
    parseValue(value) {
      if (typeof value !== "string") {
        return value;
      }

      try {
        return JSON.parse(this.sanitizeJson(value));
      } catch (err) {
        return value;
      }
    },
    //Because user might enter a JSON as JS object;
    //This method converts a JS object string to a JSON string before parsing it
    //e.g. {a:"b", 'c':1} => {"a":"b", "c":1}
    //We don't use eval here because of security reasons.
    //Using eval may cause something undesired run in the script.
    sanitizeJson(str) {
      return str.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, "\"$2\": ");
    },
  },
};
