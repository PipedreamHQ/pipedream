import orca_scan from "../../orca_scan.app.mjs";

export default {
  key: "orca_scan-add-update-row",
  name: "Add or Update Row",
  description: "Adds a new row or updates an existing row in a sheet. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
      const { data } = await this.orca_scan.listRows({
        sheetId: this.sheetId,
        params: {
          barcode: this.barcode || null,
        },
      });
      if (data.length > 0) {
        const row = data[0];
        // Assume the first row is the one to update
        rowId = row._id;
        for (const [
          key,
          value,
        ] of Object.entries(this.rowData)) {
          row[key] = value;
        }
        this.rowData = row;
      } else {
        this.rowData.barcode = this.barcode;
      }
    }

    if (!this.rowData.date) this.rowData.date = new Date();

    // Make the request to add or update the row
    const response = await this.orca_scan.addOrUpdateRow({
      sheetId: this.sheetId,
      data: this.rowData,
      rowId: rowId,
    });

    $.export("$summary", `Successfully ${rowId
      ? "updated"
      : "added"} row with ID: ${response.data?._id}`);
    return response;
  },
};
