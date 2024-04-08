import sheetdb from "../../sheetdb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sheetdb-delete-rows",
  name: "Delete Rows",
  description: "Deletes the specified row(s) in a SheetDB sheet by matching a column name and value. [See the documentation](https://docs.sheetdb.io/sheetdb-api/delete)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sheetdb,
    columnName: {
      propDefinition: [
        sheetdb,
        "columnName",
      ],
    },
    columnValue: {
      propDefinition: [
        sheetdb,
        "columnValue",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sheetdb.deleteRows({
      columnName: this.columnName,
      columnValue: this.columnValue,
    });

    $.export("$summary", `Deleted rows where ${this.columnName} is ${this.columnValue}`);
    return response;
  },
};
