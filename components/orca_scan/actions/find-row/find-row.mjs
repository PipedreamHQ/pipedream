import orca_scan from "../../orca_scan.app.mjs";

export default {
  key: "orca_scan-find-row",
  name: "Find Row",
  description: "Locates a row record based on a given barcode. If no barcode is provided, return all rows. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3#rows-1)",
  version: "0.0.{{ts}}",
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
    const sheetId = this.sheetId;
    const barcode = this.barcode || ""; // Ensure barcode is an empty string if not provided

    const rows = await this.orca_scan.getRows(sheetId, barcode);

    $.export("$summary", `Successfully found ${rows.length} row(s)`);
    return rows;
  },
};
