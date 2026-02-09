import microsoftExcel from "../../microsoft_excel.app.mjs";

export default {
  key: "microsoft_excel-find-row",
  name: "Find Row",
  description: "Find a row by column and value in an Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/range-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    column: {
      type: "string",
      label: "Column",
      description: "The column to search. E.g. `A`",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to search for",
    },
  },
  async run({ $ }) {
    const {
      rowCount, address,
    } = await this.microsoftExcel.getUsedRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
    });
    const lastColumn = address.match(/:([A-Z]+)\d+$/)[1];

    const { values: rangeValues } = await this.microsoftExcel.getRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
      range: `${this.column}1:${this.column}${rowCount}`,
    });
    const values = rangeValues.map((v) => v[0]);
    let index = values.indexOf(this.value);
    if (index === -1 && !isNaN(this.value)) {
      index = values.indexOf(+this.value);
    }

    if (index === -1) {
      $.export("$summary", "No matching rows found");
      return values;
    }

    const row = index + 1;
    const response = await this.microsoftExcel.getRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
      range: `A${row}:${lastColumn}${row}`,
    });

    $.export("$summary", `Found value in row ${row}`);
    return response;
  },
};
