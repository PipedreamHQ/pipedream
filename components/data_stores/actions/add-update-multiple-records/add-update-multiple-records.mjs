// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-multiple-records",
  name: "Add or update multiple records",
  description: "Enter data you'd like to add as key-value pairs, or reference an object from a previous step using a custom expression (e.g., `{{steps.data.$return_value}}`).",
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
    data: {
      label: "Data",
      type: "object",
      description: "Enter data you'd like to add as an object containing key-value pairs, or reference existing keys and update the values for those existing records. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
    },
  },
  methods: {
    _parseDataRecursive(obj) {
      let result = {};
      if (Array.isArray(obj)) {
        obj.forEach((o) => {
          result = {
            ...result,
            ...this._parseDataRecursive(o),
          };
        });
      } else if (typeof obj === "object") {
        result = {
          ...result,
          ...obj,
        };
      } //else pass, because it is neither object nor array
      return result;
    },
    _parseData(obj) {
      if (typeof obj === "string") {
        const sanitizedValue = obj.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, "\"$2\": ");
        const json = JSON.parse(sanitizedValue);
        return this._parseDataRecursive(json);
      } else if (typeof obj === "object") {
        const newObj = {};
        for (const [
          key,
          value,
        ] of Object.entries(obj)) {
          try {
            const sanitizedValue = value.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, "\"$2\": ");
            console.log(value, sanitizedValue);
            const json = JSON.parse(sanitizedValue);
            console.log(json);
            newObj[key] = this._parseDataRecursive(json);
            console.log(newObj[key]);
          } catch (err) {
            throw new Error("Given input cannot be parsed as JSON!");
          }
        }
        return newObj;
      }
      throw new Error("Unsupported expression");
    },
  },
  async run({ $ }) {
    console.log(this.data, typeof this.data);
    const data = this._parseData(this.data);
    for (const [
      key,
      value,
    ] of Object.entries(data)) {
      this.data_store.set(key, value);
    }
    let count = Object.keys(data).length;
    if (count == 1) {
      $.export("$summary", "Successfully added or updated 1 record.");
    } else {
      $.export("$summary", "Successfully added or updated " + count + " records.");
    }
  },
};
