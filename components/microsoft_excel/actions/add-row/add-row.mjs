import microsoftExcel from "../../microsoft_excel.app.mjs";
import { getColumnLetter } from "../../common/utils.mjs";

export default {
  key: "microsoft_excel-add-row",
  name: "Add Row",
  description: "Insert a new row into a specified Excel worksheet. [See the documentation](https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
    values: {
      type: "string[]",
      label: "Values",
      description: "An array of values for the new row. Each item in the array represents one cell. E.g. `[1, 2, 3]`",
    },
  },
  methods: {
    isArrayString(str) {
      return typeof str === "string" && ((str.startsWith("[") && str.endsWith("]")) || ((str.startsWith("[[") || str.startsWith("[ [")) && (str.endsWith("]]") || str.endsWith("] ]"))));
    },
    convertStringToArray(str) {
      const arrayString = str.match(/\[\[?(.*?)\]?\]/)[1];
      return arrayString.split(",");
    },
    parseValues(columnCount) {
      let values = this.values;
      if (Array.isArray(this.values)) {
        if (Array.isArray(this.values[0])) {
          values = this.values[0];
        } else if (this.isArrayString(this.values[0])) {
          values = this.convertStringToArray(this.values[0]);
        }
      } else {
        if (this.isArrayString(this.values)) {
          values = this.convertStringToArray(this.values);
        }
      }

      if (values.length < columnCount) {
        values.length = columnCount;
      }
      return values;
    },
  },
  async run({ $ }) {
    const {
      address, columnCount,
    } = await this.microsoftExcel.getUsedRange({
      $,
      sheetId: this.sheetId,
      worksheet: this.worksheet,
    });

    // get next row range
    const match = address.match(/^(.+!)?([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    const nextRow = parseInt(match[5], 10) + 1;
    const values = this.parseValues(columnCount);
    const colEnd = getColumnLetter(values.length);
    const range = `A${nextRow}:${colEnd}${nextRow}`;

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
          values,
        ],
      },
    });

    $.export("$summary", "Successfully added new row");
    return response;
  },
};
