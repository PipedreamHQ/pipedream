import app from "../../algolia.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "algolia-delete-records",
  name: "Delete Records",
  description: "Delete records from the given index. [See the documentation](https://www.algolia.com/doc/libraries/javascript/v5/helpers/#delete-records)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    indexName: {
      propDefinition: [
        app,
        "indexName",
      ],
    },
    recordIds: {
      type: "string[]",
      label: "Record IDs",
      description: "IDs of the records to delete also known as `objectIDs`. Eg. `[\"1\", \"2\"]`. If you don't know the IDs, you can use the **Browse Records** action to find them, then map them and then use them here as a custom expression. Eg. `{{steps.map_records_to_objectids.$return_value}}`.",
    },
  },
  methods: {
    deleteRecords(args = {}) {
      return this.app._client().deleteObjects(args);
    },
  },
  async run({ $ }) {
    const {
      deleteRecords,
      indexName,
      recordIds,
    } = this;

    const response = await deleteRecords({
      indexName,
      objectIDs: utils.parseArray(recordIds),
      waitForTasks: true,
    });

    $.export("$summary", "Successfully deleted records.");

    return response;
  },
};
