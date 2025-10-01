import app from "../../data_stores.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "data_stores-get-difference",
  name: "Get Difference",
  description: "Get the difference between two data stores. Result contains key/value pairs where the key exists in one data store, but not the other. [Pipedream Data Stores](https://pipedream.com/data-stores/).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    dataStoreA: {
      propDefinition: [
        app,
        "dataStore",
      ],
    },
    dataStoreB: {
      propDefinition: [
        app,
        "dataStore",
      ],
    },
    returnType: {
      label: "Return Type",
      description: "Specify the preferred data structure to return.",
      type: "string",
      options: options.LIST_ALL_RECORDS,
      default: "object",
    },
  },
  async run ({ $ }) {
    const keysA = await this.dataStoreA.keys();
    const keysB = await this.dataStoreB.keys();

    const difference = new Set(keysA.filter((x) => !keysB.includes(x)));

    const promises = [];
    for (const key of difference) {
      promises.push(new Promise((resolve, reject) => {
        this.dataStoreA.get(key).then((value) => {
          resolve({
            key,
            value,
          });
        })
          .catch((err) => {
            reject(err);
          });
      }));
    }
    const records = await Promise.all(promises);

    if (records.length > 0) {
      $.export("$summary", `Found ${records.length} record(s).`);
    } else {
      $.export("$summary", "No records found.");
    }

    switch (this.returnType) {
    case "object": {
      return records.reduce((acc, {
        key, value,
      }) => ({
        ...acc,
        [key]: value,
      }), {});
    }
    case "array": {
      return records;
    }
    default:
      throw new Error(`Unknown return type: ${this.returnType}`);
    }
  },
};
