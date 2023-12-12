import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-update-worksheet-tablerow",
  name: "Update Worksheet Tablerow",
  version: "0.0.1",
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
    itemId: {
      propDefinition: [
        microsoftExcel,
        "itemId",
        ({ folderId }) => ({
          folderId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        microsoftExcel,
        "tableId",
        ({ itemId }) => ({
          itemId,
        }),
      ],
    },
    rowId: {
      propDefinition: [
        microsoftExcel,
        "rowId",
        ({
          itemId, tableId,
        }) => ({
          itemId,
          tableId,
        }),
      ],
    },
    values: {
      propDefinition: [
        microsoftExcel,
        "values",
      ],
      description: "Represents the raw values of the specified range. The data returned could be of type string, number, or a boolean. Cells that contain errors return the error string.",
    },
  },
  async run({ $ }) {
    const {
      microsoftExcel,
      itemId,
      tableId,
      rowId,
      values,
    } = this;

    const response = await microsoftExcel.updateRow({
      $,
      itemId,
      tableId,
      rowId,
      data: {
        values: JSON.parse(values),
      },
    });

    $.export("$summary", `The row with index: ${rowId} was successfully updated!`);
    return response;
  },
};
