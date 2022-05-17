import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-record",
  name: "Get record",
  description: "Get a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.5",
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
      description: "Key for the data you'd like to fetch. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
    },
    addRecordIfNotFound: {
      label: "Create a new record if the key is not found?",
      description: "Create a new record if no records are found for the specified key.",
      type: "string",
      options: [
        "Yes",
        "No",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.addRecordIfNotFound === "Yes") {
      props["value"] = {
        label: "Value",
        type: "any",
        description: "Enter a string, object, or array.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const record = await this.dataStore.get(this.key);

    if (record) {
      $.export("$summary", "Found data for the key, `" + this.key + "`.");
    } else {
      if (this.addRecordIfNotFound === "Yes") {
        await this.dataStore.set(this.key, this.value);
        $.export("$summary", "Successfully added a new record with the key, `" + this.key + "`.");
        return this.dataStore.get(this.key);
      } else {
        $.export("$summary", "No data found for key, `" + this.key + "`.");
      }
    }

    return record;
  },
};
