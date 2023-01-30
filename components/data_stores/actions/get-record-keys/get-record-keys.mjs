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
      optional: true,
    },
    caseInsensitive: {
      type: "boolean",
      label: "Case Insensitive",
      description: "if true, the query will be used to filter the records based on case-Insensitivity, if false, the query will be used to filter the records that are equal to the query.",
      optional: true,
    },
  },
  methods: {
    getAllKeysWithRecord(
      obj,
      query,
      contains = false,
      caseInsensitive = false,
      path = "",
    ) {
      const filteredKeys = [];

      const helper = (obj, path) => {
        if (Array.isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            helper(obj[i], path + i + ".");
          }
          return;
        }
        else if (typeof obj === "object" && obj !== null) {
          for (let key in obj) {
            helper(obj[key], path + key + ".");
          }
          return;
        }

        if (!contains && !caseInsensitive && obj == query) {
          filteredKeys.push(path.slice(0, -1));
          return;
        }

        if (contains && caseInsensitive && String(obj).toLowerCase()
          .includes(query.toLowerCase())
        ) {
          filteredKeys.push(path.slice(0, -1));
          return;
        }

        if (contains && !caseInsensitive && String(obj).includes(query)) {
          filteredKeys.push(path.slice(0, -1));
          return;
        }

        if (!contains && caseInsensitive
          && String(obj).toLocaleLowerCase() == query.toLowerCase()
        ) {
          filteredKeys.push(path.slice(0, -1));
          return;
        }
      };

      helper(obj, path);
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

    const filteredKeys = this.getAllKeysWithRecord(
      objData,
      this.query,
      this.contains,
      this.caseInsensitive,
    );

    $.export("$summary", `Successfully returned ${filteredKeys.length} key(s).`);
    return {
      hasRegisteredKeys: filteredKeys.length > 0,
      keys: filteredKeys,
    };
  },
};
