import zohoSheet from "../../zoho_sheet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_sheet-update-row",
  name: "Update Row",
  description: "Finds a specific row by its index and updates its content. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
  version: "0.0.1",
  type: "action",
  props: {
    zohoSheet,
    worksheet: {
      propDefinition: [
        zohoSheet,
        "worksheet",
      ],
    },
    rowIndex: {
      propDefinition: [
        zohoSheet,
        "rowIndex",
      ],
    },
    data: {
      propDefinition: [
        zohoSheet,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoSheet.updateRow({
      worksheet: this.worksheet,
      rowIndex: this.rowIndex,
      data: this.data,
    });

    $.export("$summary", `Successfully updated row ${this.rowIndex} in worksheet ${this.worksheet}`);
    return response;
  },
};
