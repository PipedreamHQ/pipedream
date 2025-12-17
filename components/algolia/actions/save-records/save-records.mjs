import app from "../../algolia.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "algolia-save-records",
  name: "Save Records",
  description: "Adds records to an index. [See the documentation](https://www.algolia.com/doc/libraries/javascript/v5/helpers/#save-records).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    records: {
      type: "string[]",
      label: "Records From JSON Objects",
      description: "The records to add to the index. Each record should be a JSON object. Eg. `{\"objectID\": \"1\", \"name\": \"Jane Doe\"}`. For a better user experience, you can use the [**CSV File To Objects**](https://pipedream.com/apps/helper-functions/actions/csv-file-to-objects) **Helper Function** action to convert a CSV file to an array of objects and then map the objects to the records field here as a **Custom Expression**. Eg. `{{steps.csv_file_to_objects.$return_value}}`.",
    },
  },
  methods: {
    saveRecords(args = {}) {
      return this.app._client().saveObjects(args);
    },
  },
  async run({ $ }) {
    const {
      saveRecords,
      indexName,
      records,
    } = this;

    const response = await saveRecords({
      indexName,
      objects: utils.parseArrayAndMap(records),
      waitForTasks: true,
    });

    $.export("$summary", "Successfully created records.");
    return response;
  },
};
