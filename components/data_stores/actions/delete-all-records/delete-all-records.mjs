import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-delete-all-records",
  name: "Delete All Records",
  description: "Delete all records in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    await this.dataStore.clear();
    $.export("$summary", "Successfully deleted all records.");
  },
};
