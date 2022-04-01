// eslint-disable-next-line camelcase
import data_stores from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-multiple-records",
  name: "Add or update multiple records",
  description: "Add or update multiple records to your [Pipedream Data Store](https://pipedream.com/data-stores/).",
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
      description: "Enter data you'd like to add as key-value pairs, or reference an object from a previous step using a custom expression (e.g., `{{steps.data.$return_value}}`). Note that any keys that are duplicated will get overwritten with the last value entered (so `[{jerry: \"constanza\", jerry: \"seinfeld\"}]` will get stored as `[{jerry: \"seinfeld\"}]`).",
    },
  },
  methods: {
    //Parsing nested arrays recursively.
    //e.g. [[{"a":"b"}],[[[{"c":"d"}, {"e":"f"}], {"g":"h"}]]]
    //This allows to get key-value pairs in a nested array;
    //So it will store the data even if there is no key provided for the array.
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
    //Handling all serialized and unserialized inputs
    //to treat values as objects no matter how they entered.
    _parseData(obj) {
      if (typeof obj === "string") {
        const sanitizedValue = this.data_stores.sanitizeJson(obj);
        const json = JSON.parse(sanitizedValue);
        return this._parseDataRecursive(json);
      } else if (typeof obj === "object") {
        const newObj = {};
        for (const [
          key,
          value,
        ] of Object.entries(obj)) {
          if (typeof value === "string") {
            try {
              const sanitizedValue = this.data_stores.sanitizeJson(value);
              const json = JSON.parse(sanitizedValue);
              if (typeof json !== "object") {
                newObj[key] = json;
              } else {
                newObj[key] = this._parseDataRecursive(json);
              }
            } catch (err) {
              newObj[key] = value;
            }
          } else if (typeof value === "object") {
            newObj[key] = this._parseDataRecursive(value);
          } else {
            newObj[key] = value;
          }
        }
        return newObj;
      }
      throw new Error("Unsupported expression");
    },
  },
  async run({ $ }) {
    if (typeof this.data === "string") {
      try {
        const sanitizedValue = this.data_stores.sanitizeJson(this.data);
        JSON.parse(sanitizedValue);
      } catch (err) {
        throw new Error("please provide an object or object array!");
      }
    }
    let data = this._parseData(this.data);
    for (const [
      key,
      value,
    ] of Object.entries(data)) {
      this.data_store.set(key, value);
    }
    let count = Object.keys(data).length;
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully added or updated ${count} record${count !== 1 ? "s" : ""}.`);
    return data;
  },
};
