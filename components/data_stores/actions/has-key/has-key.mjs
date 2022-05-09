import app from "../../data_stores.app.mjs";

export default {
  key: "data_store-has-key",
  name: "Has Key",
  description: "Check if a key exists in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
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
    key: {
      label: "Key",
      type: "string",
      description: "The key to check.",
    },
  },
  async run ({ $ }) {
    const hasKey = await this.dataStore.has(this.key);
    $.export("$summary", hasKey
      ? "Key \"" + this.key + "\" exists."
      : "Key \"" + this.key + "\" does not exist.");
    return hasKey;
  },
};
