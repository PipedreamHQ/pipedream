import zohoSheet from "../../zoho_sheet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_sheet-search-delete-row",
  name: "Search and Delete Row",
  description: "Searches for a row based on provided criteria and deletes it. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zohoSheet,
    worksheet: {
      propDefinition: [
        zohoSheet,
        "worksheet",
      ],
    },
    criteria: {
      propDefinition: [
        zohoSheet,
        "criteria",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoSheet.deleteRow({
      worksheet: this.worksheet,
      criteria: this.criteria,
    });

    $.export("$summary", `Row matching criteria deleted successfully from worksheet ${this.worksheet}`);
    return response;
  },
};
