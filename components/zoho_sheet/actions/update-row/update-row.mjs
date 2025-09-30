import { parseObject } from "../../common/utils.mjs";
import zohoSheet from "../../zoho_sheet.app.mjs";

export default {
  key: "zoho_sheet-update-row",
  name: "Update Row",
  description: "Finds a specific row by its index and updates its content. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
      propDefinition: [
        zohoSheet,
        "headerRow",
      ],
      optional: true,
    },
    criteria: {
      propDefinition: [
        zohoSheet,
        "criteria",
      ],
      description: "If criteria is not set all available rows will get updated. Mention the criteria as described above.",
      optional: true,
    },
    firstMatchOnly: {
      propDefinition: [
        zohoSheet,
        "firstMatchOnly",
      ],
      description: "If true and if there are multiple records on the specified criteria, records will be updated for first match alone. Otherwise, all the matched records will be updated.",
    },
    isCaseSensitive: {
      propDefinition: [
        zohoSheet,
        "isCaseSensitive",
      ],
    },
    data: {
      propDefinition: [
        zohoSheet,
        "data",
      ],
      type: "object",
      description: "The JSON data that needs to be updated. Example:{\"Month\":\"May\",\"Amount\":50}",
    },
  },
  async run({ $ }) {
    const response = await this.zohoSheet.updateRow({
      $,
      workbookId: this.workbookId,
      data: {
        worksheet_id: this.worksheet,
        header_row: this.headerRow,
        criteria: this.criteria,
        first_match_only: this.firstMatchOnly,
        is_case_sensitive: this.isCaseSensitive,
        data: JSON.stringify(parseObject(this.data)),
      },
    });

    $.export("$summary", `Successfully updated ${response.no_of_affected_rows} row(s) in worksheet ${this.worksheet}`);
    return response;
  },
};
