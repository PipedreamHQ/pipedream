import zohoSheet from "../../zoho_sheet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_sheet-create-row",
  name: "Create Row",
  description: "Creates a new row in the specified worksheet. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
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
    data: {
      propDefinition: [
        zohoSheet,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zohoSheet.createRow({
      worksheet: this.worksheet,
      data: this.data,
    });

    $.export("$summary", `Successfully created a row in the worksheet: ${this.worksheet}`);
    return response;
  },
};
