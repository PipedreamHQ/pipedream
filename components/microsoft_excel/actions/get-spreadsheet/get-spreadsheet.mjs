import microsoftExcel from "../../microsoft_excel.app.mjs";
import { json2csv } from "json-2-csv";

export default {
  key: "microsoft_excel-get-spreadsheet",
  name: "Get Spreadsheet",
  description: "Get the values of a specified Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/range-get?view=graph-rest-1.0&tabs=http)",
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
    range: {
      type: "string",
      label: "Range",
      description: "The range within the worksheet to retrieve. E.g. `A1:C4`. If not specified, entire \"usedRange\" will be returned",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.range
      ? await this.microsoftExcel.getRange({
        $,
        sheetId: this.sheetId,
        worksheet: this.worksheet,
        range: `${this.range}`,
      })
      : await this.microsoftExcel.getUsedRange({
        $,
        sheetId: this.sheetId,
        worksheet: this.worksheet,
      });

    const csv = await json2csv(response.values);
    response.csv = csv;

    $.export("$summary", "Successfully retrieved spreadsheet values");
    return response;
  },
};
