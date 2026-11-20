import microsoftExcel from "../../microsoft_excel.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "microsoft_excel-update-worksheet-tablerow",
  name: "Update Worksheet Tablerow",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update the properties of tablerow object. `(Only for work or school account)` [See the documentation](https://learn.microsoft.com/en-us/graph/api/tablerow-update?view=graph-rest-1.0&tabs=http)",
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
    rowId: {
      propDefinition: [
        microsoftExcel,
        "tableRowId",
        ({
          sheetId, tableId, driveId,
        }) => ({
          sheetId,
          tableId,
          driveId,
        }),
      ],
    },
    values: {
      propDefinition: [
        microsoftExcel,
        "values",
      ],
      description: "An array of values for the updated row. Each item in the array represents one cell. E.g. `[1, 2, 3]`",
    },
  },
  async run({ $ }) {
    const {
      microsoftExcel,
      sheetId,
      tableId,
      rowId,
      values,
    } = this;

    const response = await microsoftExcel.updateTableRow({
      $,
      driveId: this.driveId,
      sheetId,
      tableId,
      rowId,
      data: {
        values: [
          parseObject(values),
        ],
      },
    });

    $.export("$summary", `The row with index: ${rowId} was successfully updated!`);
    return response;
  },
};
