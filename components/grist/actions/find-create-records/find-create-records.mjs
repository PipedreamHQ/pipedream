import grist from "../../grist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grist-find-create-records",
  name: "Find or Create Records in Grist",
  description: "Searches for a record in a specified table and creates a new one if not found. [See the documentation](https://support.getgrist.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    grist,
    tableName: {
      propDefinition: [
        grist,
        "tableName",
      ],
    },
    recordData: {
      propDefinition: [
        grist,
        "recordData",
      ],
    },
    searchParameters: {
      propDefinition: [
        grist,
        "searchParameters",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      tableName, recordData, searchParameters,
    } = this;
    const searchParams = searchParameters || {};

    // Search for the record using the provided searchParameters
    const existingRecord = await this.grist.searchRecord({
      tableName,
      searchParameters: searchParams,
    });

    let response;
    if (existingRecord) {
      // If record exists, return it
      response = existingRecord;
      $.export("$summary", `Found existing record in table '${tableName}'`);
    } else {
      // If not, create a new record
      response = await this.grist.createOrUpdateRecord({
        tableName,
        recordData,
        matchKeys: searchParams,
      });
      $.export("$summary", `Created new record in table '${tableName}'`);
    }

    return response;
  },
};
