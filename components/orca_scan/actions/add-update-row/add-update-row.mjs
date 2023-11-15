import orca_scan from "../../orca_scan.app.mjs";

export default {
  key: "orca_scan-add-update-row",
  name: "Add or Update Row",
  description: "Adds a new row or updates an existing row in a sheet. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3)",
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
    rowData: {
      propDefinition: [
        orca_scan,
        "rowData",
      ],
    },
    barcode: {
      propDefinition: [
        orca_scan,
        "barcode",
      ],
    },
  },
  async run({ $ }) {
    let rowId = null;

    // Check if a row with the given barcode exists
    if (this.barcode) {
      const rows = await this.orca_scan.getRows(this.sheetId, this.barcode);
      if (rows.length > 0) {
        // Assume the first row is the one to update
        rowId = rows[0]._id;
      }
    }

    // Make the request to add or update the row
    const response = await this.orca_scan.addOrUpdateRow(this.sheetId, this.rowData, rowId);

    $.export("$summary", `Successfully ${rowId
      ? "updated"
      : "added"} row in sheet ${this.sheetId}`);
    return response;
  },
};
