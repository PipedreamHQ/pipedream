import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-list-keys",
  name: "List keys",
  description: "List all keys in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.4",
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
  },
  async run ({ $ }) {
    const keys = await this.dataStore.keys();
    if (keys.length > 0) {
      $.export("$summary", `Found ${keys.length} key(s).`);
    } else {
      $.export("$summary", "No keys found.");
    }
    return keys;
  },
};
