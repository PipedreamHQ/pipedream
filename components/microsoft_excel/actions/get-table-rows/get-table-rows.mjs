import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-get-table-rows",
  name: "Get Table Rows",
  description: "Retrieve rows from a specified table in an Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/tablerow-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftExcel,
    driveId: {
      propDefinition: [
        microsoftExcel,
        "driveId",
      ],
    },
    folderId: {
      propDefinition: [
        microsoftExcel,
        "folderId",
        ({ driveId }) => ({
          driveId,
        }),
      ],
    },
    sheetId: {
      propDefinition: [
        microsoftExcel,
        "sheetId",
        ({
          folderId, driveId,
        }) => ({
          folderId,
          driveId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        microsoftExcel,
        "tableId",
        ({
          sheetId, driveId,
        }) => ({
          sheetId,
          driveId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { value } = await this.microsoftExcel.listTableRows({
      $,
      driveId: this.driveId,
      sheetId: this.sheetId,
      tableId: this.tableId,
    });

    $.export("$summary", `Successfully retrieved ${value.length} row${value.length === 1
      ? ""
      : "s"}`);

    return value;
  },
};
