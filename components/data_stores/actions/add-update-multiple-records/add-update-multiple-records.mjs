// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";
import xss from "xss";

export default {
  key: "data_stores-add-update-multiple-records",
  name: "Add or update multiple records",
  description: "Add or update multiple records to your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.5",
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
    data: {
      label: "Data",
      type: "object",
      description: "Enter data you'd like to add as key-value pairs, or reference an object from a previous step using a custom expression (e.g., `{{steps.data.$return_value}}`). Note that any keys that are duplicated will get overwritten with the last value entered (so `[{jerry: \"constanza\", jerry: \"seinfeld\"}]` will get stored as `[{jerry: \"seinfeld\"}]`).",
    },
  },
  methods: {
    /**
     * Tries to convert a string to a JSON object or a primitive value.
     * @param {any} value Value to be converted
     * @returns The converted value
     */
    convertString(value) {
      // If type is already primitive non string, return it
      if ([
        "boolean",
        "number",
      ].includes(typeof value)) {
        return value;
      }

      // Tries to convert string to possible other primitive types
      if (typeof value === "string") {
        // Convert boolean
        if (value.toLowerCase() === "true") {
          return true;
        }
        if (value.toLowerCase() === "false") {
          return false;
        }

        // Convert number
        if (!isNaN(value)) {
          return parseFloat(value);
        }
      }

      // Try to evaluate string as javascript, using xss as extra security
      // If some problem occurs, return the original string
      try {
        return eval(`(${xss(value)})`);
      } catch {
        return value;
      }
    },
    /**
     * Add all the key-value pairs in the map object to be used in the data store
     * @param {*} data Data to be parsed
     * @param {Map} map Hashmap to be updated
     */
    populateHashMapOfData(data, map) {
      if (!Array.isArray(data) && typeof(data) === "object") {
        const keys = Object.keys(data);
        for (const key of keys) {
          map[key] = this.convertString(data[key]);
        }
        return;
      }

      if (Array.isArray(data)) {
        for (const item of data) {
          this.populateHashMapOfData(item, map);
        }
      }
    },
    getHashMapOfData(data) {
      const map = {};
      this.populateHashMapOfData(data, map);
      return map;
    },
  },
  async run({ $ }) {
    if (typeof this.data === "string") {
      this.data = eval(`(${this.data})`);
    }
    const map = this.getHashMapOfData(this.data);
    const keys = Object.keys(map);
    const promises = [];
    for (const key of keys) {
      promises.push(this.data_store.set(key, map[key]));
    }
    await Promise.all(promises);
    $.export("$summary", `Successfully added or updated ${keys.length} record(s)`);
  },
};
