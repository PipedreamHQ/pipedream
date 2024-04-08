import sheetdb from "../../sheetdb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sheetdb-get-column-names",
  name: "Get Column Names",
  description: "Get column names of a Google Sheet using the SheetDB API. [See the documentation](https://docs.sheetdb.io/sheetdb-api/read#keys)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sheetdb,
  },
  async run({ $ }) {
    const response = await this.sheetdb.getColumnNames();
    $.export("$summary", "Retrieved column names successfully");
    return response;
  },
};
