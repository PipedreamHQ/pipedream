import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-record-keys",
  name: "Get Record Keys",
  description: "Get all record keys in your [Pipedream Data Store](https://pipedream.com/data-stores/) that matches with your query. The memory consumption of the workflow can be affected, since this action will be exposing, to the workflow, the entire data from the selected datastore",
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
    query: {
      type: "string",
      label: "Query",
      description: "The query to filter the records.",
    },
    contains: {
      type: "boolean",
      label: "Contains",
      description: "If `true`, the query will be used to filter the records that contains the query. If `false`, the query will be used to filter the records that are equal to the query.",
      optional: true,
    },
    caseInsensitive: {
      type: "boolean",
      label: "Case Insensitive",
      description: "If `true`, the query will be used to filter the records based on case-insensitivity. If `false`, the query will be used to filter the records that are equal to the query.",
      optional: true,
    },
  },
  methods: {
    containsQuery(obj, query, caseInsensitive = true) {
      obj = String(obj);
      return caseInsensitive
        ? obj.toLowerCase().includes(query.toLowerCase())
        : obj.includes(query);
    },
    matchesQuery(obj, query, caseInsensitive = true) {
      obj = String(obj);
      return caseInsensitive
        ? obj.toLowerCase() === query.toLowerCase()
        : obj === query;
    },
    getAllKeysWithRecord(
      obj,
      query,
      contains = false,
      caseInsensitive = false,
      path = "",
    ) {
      const filteredKeys = [];
      const values = [];

      const helper = (obj, path) => {
        // if the value is an array, iterate through it
        if (Array.isArray(obj)) {
          for (let i = 0; i < obj.length; i++) {
            helper(obj[i], path + i + ".");
          }
          return;
        }

        // if the value is an object, iterate through it
        else if (typeof obj === "object" && obj !== null) {
          for (let key in obj) {
            helper(obj[key], path + key + ".");
          }
          return;
        }

        const matched = (
          (contains && this.containsQuery(obj, query, caseInsensitive)) ||
          (!contains && this.matchesQuery(obj, query, caseInsensitive))
        );

        if (matched) {
          filteredKeys.push(path.slice(0, -1));
          values.push(obj);
        }
      };

      helper(obj, path);
      return {
        filteredKeys,
        values,
      };
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

    const {
      filteredKeys,
      values,
    } = this.getAllKeysWithRecord(
      objData,
      this.query,
      this.contains,
      this.caseInsensitive,
    );

    $.export("$summary", `Successfully returned ${filteredKeys.length} key(s). Please notice that values[0] refer to the first key in keys[0] and so on.`);
    return {
      hasRegisteredKeys: filteredKeys.length > 0,
      keys: filteredKeys,
      values,
    };
  },
};
