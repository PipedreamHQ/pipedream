import microsoftExcel from "../../microsoft_excel.app.mjs";
import { json2csv } from "json-2-csv";

export default {
  key: "microsoft_excel-get-spreadsheet",
  name: "Get Spreadsheet",
  description: "Get the values of a specified Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/range-get?view=graph-rest-1.0&tabs=http)",
  version: "0.1.0",
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
    hasHeaders: {
      type: "boolean",
      label: "Has Headers",
      description: "Whether the first row of the range contains column headers. If `true`, also returns `headers` and `rows` (one object per data row, keyed by header; duplicate headers get a numeric suffix, e.g. `Amount_2`). E.g. `true`",
      optional: true,
      default: false,
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

    if (this.hasHeaders) {
      const [
        headerRow = [],
        ...dataRows
      ] = response.values;
      const used = new Set(headerRow.map(String));
      const counts = new Map();
      const headers = headerRow.map((header) => {
        const name = String(header);
        if (name === "") {
          return name;
        }
        const count = (counts.get(name) || 0) + 1;
        counts.set(name, count);
        if (count === 1) {
          return name;
        }
        let suffix = count;
        while (used.has(`${name}_${suffix}`)) {
          suffix++;
        }
        const key = `${name}_${suffix}`;
        used.add(key);
        return key;
      });
      response.headers = headers;
      response.rows = dataRows.map((row) => Object.fromEntries(
        headers
          .map((header, i) => [
            header,
            row[i],
          ])
          .filter(([
            header,
          ]) => header !== ""),
      ));
    }

    $.export("$summary", "Successfully retrieved spreadsheet values");
    return response;
  },
};
