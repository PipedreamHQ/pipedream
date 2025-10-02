import { parseObject } from "../../common/utils.mjs";
import zohoSheet from "../../zoho_sheet.app.mjs";

export default {
  key: "zoho_sheet-create-row",
  name: "Create Row",
  description: "Creates a new row in the specified worksheet. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoSheet,
    workbookId: {
      propDefinition: [
        zohoSheet,
        "workbookId",
      ],
    },
    worksheet: {
      propDefinition: [
        zohoSheet,
        "worksheet",
        ({ workbookId }) => ({
          workbookId,
        }),
      ],
    },
    headerRow: {
      type: "integer",
      label: "Header Row",
      description: "Default value is 1. This can be mentioned if the table header is not in the first row of the worksheet.",
      optional: true,
    },
    data: {
      propDefinition: [
        zohoSheet,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoSheet.createRow({
      $,
      workbookId: this.workbookId,
      data: {
        worksheet_id: this.worksheet,
        header_row: this.headerRow || 1,
        json_data: JSON.stringify(parseObject(this.data)),
      },
    });

    $.export("$summary", `Successfully created a row in the worksheet: ${response.sheet_name}`);
    return response;
  },
};
