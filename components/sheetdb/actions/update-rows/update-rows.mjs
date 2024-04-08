import sheetdb from "../../sheetdb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sheetdb-update-rows",
  name: "Update Rows in Google Sheet",
  description: "Updates rows in a Google Sheet using the SheetDB API. [See the documentation](https://docs.sheetdb.io/sheetdb-api/update)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sheetdb,
    data: {
      propDefinition: [
        sheetdb,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const parsedData = this.data.map(JSON.parse);
    const response = await this.sheetdb.updateRows({
      data: parsedData,
    });

    $.export("$summary", `Updated ${parsedData.length} rows in the Google Sheet`);
    return response;
  },
};
