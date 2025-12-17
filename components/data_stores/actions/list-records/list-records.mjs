/* eslint-disable newline-per-chained-call */
import app from "../../data_stores.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "data_stores-list-records",
  name: "List Records",
  description: "List all records in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    keys: {
      propDefinition: [
        app,
        "key",
        ({ dataStore }) => ({
          dataStore,
        }),
      ],
      description: "Select one or multiple keys to retrieve their records.",
      type: "string[]",
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
    let keys = await this.dataStore.keys();
    if (this.keys.length > 0) {
      keys = keys.filter((key) => this.keys.includes(key));
    }
    const promises = [];
    for (const key of keys) {
      promises.push(new Promise((resolve, reject) => {
        this.dataStore.get(key).then((value) => {
          resolve({
            key,
            value,
          });
        }).catch((err) => {
          reject(err);
        });
      }));
    }

    const records = await Promise.all(promises);
    if (keys.length > 0) {
      $.export("$summary", `Found ${keys.length} record(s).`);
    } else {
      $.export("$summary", "No record found.");
    }

    switch (this.returnType) {
    case "object": {
      return records.reduce((acc, record) => {
        acc[record.key] = record.value;
        return acc;
      }, {});
    }
    case "array": {
      return records;
    }
    default:
      throw new Error(`Unknown return type: ${this.returnType}`);
    }
  },
};
