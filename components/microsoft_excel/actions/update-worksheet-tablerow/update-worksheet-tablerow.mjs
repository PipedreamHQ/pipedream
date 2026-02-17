import microsoftExcel from "../../microsoft_excel.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "microsoft_excel-update-worksheet-tablerow",
  name: "Update Worksheet Tablerow",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update the properties of tablerow object. `(Only for work or school account)` [See the documentation](https://learn.microsoft.com/en-us/graph/api/tablerow-update?view=graph-rest-1.0&tabs=http)",
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
    rowId: {
      propDefinition: [
        microsoftExcel,
        "tableRowId",
        ({
          sheetId, tableId,
        }) => ({
          sheetId,
          tableId,
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
