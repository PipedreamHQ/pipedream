import orca_scan from "../../orca_scan.app.mjs";

export default {
  key: "orca_scan-find-row",
  name: "Find Row",
  description: "Locates a row record based on a given barcode. If no barcode is provided, return all rows. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3#rows-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    orca_scan,
    sheetId: {
      propDefinition: [
        orca_scan,
        "sheetId",
      ],
    },
    barcode: {
      propDefinition: [
        orca_scan,
        "barcode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const rows = await this.orca_scan.listRows({
      sheetId: this.sheetId,
      params: {
        barcode: this.barcode || null,
      },
    });

    $.export("$summary", `Successfully found ${rows.data?.length} row(s)`);
    return rows;
  },
};
