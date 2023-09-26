import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-add-a-worksheet-tablerow",
  name: "Add A Worksheet Tablerow",
  version: "0.0.1",
  description: "Adds rows to the end of specific table. [See the documentation](https://learn.microsoft.com/en-us/graph/api/tablerowcollection-add?view=graph-rest-1.0&tabs=http)",
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
    values: {
      propDefinition: [
        microsoftExcel,
        "values",
      ],
    },
  },
  async run({ $ }) {
    const {
      microsoftExcel,
      itemId,
      tableId,
      values,
    } = this;

    const response = await microsoftExcel.addRow({
      $,
      itemId,
      tableId,
      data: {
        values: JSON.parse(values),
      },
    });

    $.export("$summary", "The rows were successfully added!");
    return response;
  },
};
