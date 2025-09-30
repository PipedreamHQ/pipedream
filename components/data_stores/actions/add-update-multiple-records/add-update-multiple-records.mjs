import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-multiple-records",
  name: "Add or update multiple records",
  description: "Add or update multiple records to your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    dataStore: {
      propDefinition: [
        app,
        "dataStore",
      ],
    },
    data: {
      label: "Data",
      type: "object",
      description: "Enter data you'd like to add as key-value pairs, or reference an object from a previous step using a custom expression (e.g., `{{steps.data.$return_value}}`). Note that any keys that are duplicated will get overwritten with the last value entered (so `[{jerry: \"constanza\", jerry: \"seinfeld\"}]` will get stored as `[{jerry: \"seinfeld\"}]`).",
    },
    ttl: {
      propDefinition: [
        app,
        "ttl",
      ],
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
      const primitives = [
        "boolean",
        "number",
      ];
      if (primitives.includes(typeof value)) {
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

      return this.app.evaluate(value);
    },
    /**
     * Add all the key-value pairs in the map object to be used in the data store
     * @param {*} data Data to be parsed
     * @param {Map} map Hashmap to be updated
     */
    populateHashMapOfData(data, map) {
      if (!Array.isArray(data) && typeof(data) === "object") {
        Object.keys(data).forEach((key) => map[key] = this.convertString(data[key]));
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
      this.data = this.app.evaluate(this.data);
    }
    const map = this.getHashMapOfData(this.data);
    const keys = Object.keys(map);

    const promises = Object.keys(map).map((key) => {
      if (this.ttl) {
        return this.dataStore.set(key, map[key], {
          ttl: this.ttl,
        });
      } else {
        return this.dataStore.set(key, map[key]);
      }
    });

    await Promise.all(promises);

    if (keys.length === 0) {
      $.export("$summary", "No data was added to the data store.");
    } else {
      // eslint-disable-next-line multiline-ternary
      $.export("$summary", `Successfully added or updated ${keys.length} record${keys.length === 1 ? "" : "s"}${this.ttl ? ` (expires in ${this.app.formatTtl(this.ttl)})` : ""}`);
    }

    // Include TTL in the returned map
    return {
      ...map,
      _ttl: this.ttl || null,
    };
  },
};
