import microsoftExcel from "../../microsoft_excel.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "microsoft_excel-get-columns",
  name: "Get Columns",
  description: "Get the values of the specified columns in an Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/range-get?view=graph-rest-1.0&tabs=http)",
  version: "0.0.2",
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
    columns: {
      type: "string[]",
      label: "Columns",
      description: "An array of column labels to retrieve. E.g. [\"A\", \"C\"]",
    },
  },
  async run({ $ }) {
    const { rowCount } = await this.microsoftExcel.getUsedRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
    });

    const values = {};
    const columns = parseObject(this.columns);
    for (const column of columns) {
      const response = await this.microsoftExcel.getRange({
        $,
        sheetId: this.sheetId,
        worksheet: this.worksheet,
        range: `${column}1:${column}${rowCount}`,
      });
      values[column] = response.values.map((v) => v[0]);
    }

    $.export("$summary", "Successfully retrieved column values");

    return values;
  },
};
