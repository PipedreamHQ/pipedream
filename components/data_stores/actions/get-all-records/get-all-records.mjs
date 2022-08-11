import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-all-records",
  name: "Get all records",
  description: "Get all records in your [Pipedream Data Store](https://pipedream.com/data-stores/). The memory consumption of the workflow can be affected, since this action will be exposing, to the workflow, the entire data from the selected datastore.",
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
    $.export("$summary", `Successfully returned ${keys.length} keys.`);
    return objData;
  },
};
