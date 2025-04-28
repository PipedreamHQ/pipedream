import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-get-table-rows",
  name: "Get Table Rows",
  description: "Retrieve rows from a specified table in an Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/tablerow-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftExcel,
    folderId: {
      propDefinition: [
        microsoftExcel,
        "folderId",
      ],
    },
    sheetId: {
      propDefinition: [
        microsoftExcel,
        "sheetId",
        ({ folderId }) => ({
          folderId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        microsoftExcel,
        "tableId",
        ({ sheetId }) => ({
          sheetId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const rows = [];
    const params = {
      $top: 100,
      $skip: 0,
    };
    let total;

    do {
      const { value } = await this.microsoftExcel.listTableRows({
        $,
        sheetId: this.sheetId,
        tableId: this.tableId,
        params,
      });
      rows.push(...value);
      total = value.length;
      params["$skip"] += params["$top"];
    } while (total);

    $.export("$summary", `Successfully retrieved ${rows.length} row${rows.length === 1
      ? ""
      : "s"}`);
    return rows;
  },
};
