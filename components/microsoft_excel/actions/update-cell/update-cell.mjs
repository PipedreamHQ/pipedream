import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-update-cell",
  name: "Update Cell",
  description: "Update the value of a specific cell in an Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/range-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    worksheet: {
      propDefinition: [
        microsoftExcel,
        "worksheet",
        ({ sheetId }) => ({
          sheetId,
        }),
      ],
    },
    cell: {
      type: "string",
      label: "Cell",
      description: "The address of the cell to update. E.g. `A1`",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to enter in the cell",
    },
  },
  async run({ $ }) {
    const response = await this.microsoftExcel.updateRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
      range: `${this.cell}:${this.cell}`,
      data: {
        values: [
          [
            this.value,
          ],
        ],
      },
    });
    $.export("$summary", `Successfully updated cell \`${this.cell}\``);
    return response;
  },
};
