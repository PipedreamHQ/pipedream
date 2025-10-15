import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import zohoSheet from "../../zoho_sheet.app.mjs";

export default {
  key: "zoho_sheet-search-delete-row",
  name: "Search and Delete Row",
  description: "Searches for a row based on provided criteria and deletes it. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
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
      optional: true,
    },
    rowArray: {
      type: "integer[]",
      label: "Row Array",
      description: "Array of row indexs, which needs to be deleted.",
      optional: true,
    },
    firstMatchOnly: {
      propDefinition: [
        zohoSheet,
        "firstMatchOnly",
      ],
    },
    isCaseSensitive: {
      propDefinition: [
        zohoSheet,
        "isCaseSensitive",
      ],
    },
    deleteRows: {
      type: "boolean",
      label: "Delete Rows",
      description: "If true it will delete the rows completely, otherwise the records are only erased by default.",
      default: false,
    },
  },
  async run({ $ }) {
    if (!this.criteria && !this.rowArray) {
      throw new ConfigurationError("You must provide at least **Criteria** or **Row Array** to process this request.");
    }
    const response = await this.zohoSheet.deleteRow({
      $,
      workbookId: this.workbookId,
      data: {
        worksheet_id: this.worksheet,
        header_row: this.headerRow,
        criteria: this.criteria,
        row_array: JSON.stringify(parseObject(this.rowArray)),
        first_match_only: this.firstMatchOnly,
        is_case_sensitive: this.isCaseSensitive,
        delete_rows: this.deleteRows,
      },
    });

    $.export("$summary", `Row matching criteria deleted successfully from worksheet ${this.worksheet}`);
    return response;
  },
};
