import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-add-row",
  name: "Add Row",
  description: "Insert a new row into a specified Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http)",
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
    worksheet: {
      propDefinition: [
        microsoftExcel,
        "worksheet",
        ({ sheetId }) => ({
          sheetId,
        }),
      ],
    },
    values: {
      type: "string[]",
      label: "Values",
      description: "An array of values for the new row. Each item in the array represents one cell. E.g. `[1, 2, 3]`",
    },
  },
  async run({ $ }) {
    const { address } = await this.microsoftExcel.getUsedRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
    });

    // get next row range
    const match = address.match(/^(.+!)?([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    const [
      , sheet = "",
      colStart,
      /* eslint-disable no-unused-vars */
      rowStart,
      colEnd,
    ] = match;
    const nextRow = parseInt(match[5], 10) + 1;
    const range = `${sheet}${colStart}${nextRow}:${colEnd}${nextRow}`;

    // insert range
    await this.microsoftExcel.insertRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
      range,
      data: {
        shift: "Down",
      },
    });

    // update range
    const response = await this.microsoftExcel.updateRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
      range,
      data: {
        values: [
          this.values,
        ],
      },
    });

    $.export("$summary", "Successfully added new row");
    return response;
  },
};
