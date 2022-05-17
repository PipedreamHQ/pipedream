import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-has-key",
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
      propDefinition: [
        app,
        "key",
        ({ dataStore }) => ({
          dataStore,
        }),
      ],
      description: "The key to check.",
    },
  },
  async run ({ $ }) {
    const hasKey = await this.dataStore.has(this.key);
    $.export("$summary", hasKey
      ? `Key "${this.key}" exists.`
      : `Key "${this.key}" does not exist.`);
    return hasKey;
  },
};
