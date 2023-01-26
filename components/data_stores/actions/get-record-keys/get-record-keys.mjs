import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-record-keys",
  name: "Get Record Keys",
  description: "Get all record keys in your [Pipedream Data Store](https://pipedream.com/data-stores/) that mathces with your query. The memory consumption of the workflow can be affected, since this action will be exposing, to the workflow, the entire data from the selected datastore",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    dataStore: {
      propDefinition: [
        app,
        "dataStore",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to filter the records.",
    },
    contains: {
      type: "boolean",
      label: "Contains",
      description: "If true, the query will be used to filter the records that contains the query. If false, the query will be used to filter the records that are equal to the query.",
      default: true,
    },
    caseInsensitive: {
      type: "boolean",
      label: "Case Insensitive",
      description: "If true, the query will be used to filter the records that contains the query, ignoring the case. If false, the query will be used to filter the records that are equal to the query. Only works if `contains` is `true`.",
      default: true,
    },
  },
  methods: {
    getAllKeysWithRecord(obj, query, path = "") {
      const filteredKeys = [];

      const helper = (obj, query, path) => {
        if (Array.isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            helper(obj[i], query, path + i + ".");
          }
        }
        else if (typeof obj === "object" && obj !== null) {
          for (let key in obj) {
            helper(obj[key], query, path + key + ".");
          }
        }

        if (this.contains) {
          if (this.caseInsensitive) {
            console.log(obj);
            if (String(obj).toLowerCase()
              .includes(query.toLowerCase())
            ) {
              filteredKeys.push(path.slice(0, -1));
              return;
            }
          }

          if (String(obj).includes(query)) {
            filteredKeys.push(path.slice(0, -1));
            return;
          }
        }

        if (obj == query) {
          filteredKeys.push(path.slice(0, -1));
        }
      };

      helper(obj, query, path);
      return filteredKeys;
    },
  },
  async run({ $ }) {
    const { dataStore } = this;
    const keys = await dataStore.keys();
    const promises = [];
    for (const key of keys) {
      promises.push(dataStore.get(key));
    }
    const arrData = await Promise.all(promises);
    const objData = {};
    for (let i = 0; i < keys.length; i++) {
      objData[keys[i]] = arrData[i];
    }

    const filteredKeys = this.getAllKeysWithRecord(objData, this.query);

    $.export("$summary", `Successfully returned ${filteredKeys.length} key(s).`);
    return {
      hasRegisteredKeys: filteredKeys.length > 0,
      keys: filteredKeys,
    };
  },
};
