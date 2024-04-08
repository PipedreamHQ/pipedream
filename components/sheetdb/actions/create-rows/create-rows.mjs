import sheetdb from "../../sheetdb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sheetdb-create-rows",
  name: "Create Rows in Google Sheet",
  description: "Create rows in a Google Sheet using the SheetDB API. [See the documentation](https://docs.sheetdb.io/sheetdb-api/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sheetdb,
    data: {
      propDefinition: [
        sheetdb,
        "data",
      ],
      type: "string[]",
      label: "Row Data",
      description: "An array of strings representing the rows to create in a Google Sheet as JSON objects.",
    },
  },
  async run({ $ }) {
    let createdRowsCount = 0;
    try {
      const parsedData = this.data.map(JSON.parse);
      const response = await this.sheetdb.createRows({
        data: parsedData,
      });
      createdRowsCount = response.created;
    } catch (error) {
      throw new Error(`Error creating rows: ${error.message}`);
    }

    $.export("$summary", `Successfully created ${createdRowsCount} row(s) in Google Sheet`);
    return {
      createdRowsCount,
    };
  },
};
