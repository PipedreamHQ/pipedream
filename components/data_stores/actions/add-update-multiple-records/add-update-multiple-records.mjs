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
    //Because user might enter a JSON as JS object, this method converts a JS object string to a JSON string before parsing it, e.g. {a:"b", 'c':1} => {"a":"b", "c":1}
    //We don't use eval here because of security reasons. Using eval may cause something undesired run in the script.
    _sanitizeJson(str) {
      return str.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, "\"$2\": ");
    },
    //Parsing nested arrays recursively. e.g. [[{"a":"b"}],[[[{"c":"d"}, {"e":"f"}], {"g":"h"}]]]
    //This allows to get key-value pairs in a nested array, so it will store the data even if there is no key provided for the array.
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
    //Handling all serialized and unserialized inputs to treat values as objects no matter how they entered.
    _parseData(obj) {
      if (typeof obj === "string") {
        const sanitizedValue = this._sanitizeJson(obj);
        const json = JSON.parse(sanitizedValue);
        return this._parseDataRecursive(json);
      } else if (typeof obj === "object") {
        const newObj = {};
        for (const [
          key,
          value,
        ] of Object.entries(obj)) {
          try {
            const sanitizedValue = this._sanitizeJson(value);
            const json = JSON.parse(sanitizedValue);
            newObj[key] = this._parseDataRecursive(json);
          } catch (err) {
            if (typeof value === "object") {
              newObj[key] = this._parseDataRecursive(value);
            } else {
              newObj[key] = value;
            }
          }
        }
        return newObj;
      }
      throw new Error("Unsupported expression");
    },
  },
  async run({ $ }) {
    let data;
    if (typeof this.data !== "object") {
      try {
        const sanitizedValue = this._sanitizeJson(this.data);
        data = JSON.parse(sanitizedValue);
      } catch (err) {
        throw new Error("please provide an object or object array!");
      }
    }
    data = this._parseData(this.data);
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
