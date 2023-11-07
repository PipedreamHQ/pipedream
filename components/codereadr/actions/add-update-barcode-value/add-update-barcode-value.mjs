import codereadr from "../../codereadr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "codereadr-add-update-barcode-value",
  name: "Add or Update Barcode Value",
  description: "Adds or updates a barcode value in the selected database. [See the documentation](https://secure.codereadr.com/apidocs/databases.md)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    codereadr,
    databaseId: {
      propDefinition: [
        codereadr,
        "databaseId",
      ],
    },
    barcodeValue: {
      type: "string",
      label: "Barcode Value",
      description: "The value of the barcode to add or update",
    },
    barcodeId: {
      type: "string",
      label: "Barcode ID",
      description: "The ID of the barcode to update (leave blank to add a new barcode)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      value: this.barcodeValue,
    };

    if (this.barcodeId) {
      data.id = this.barcodeId;
    }

    const response = await this.codereadr.addOrUpdateBarcode(this.databaseId, data);
    $.export("$summary", `Barcode value ${this.barcodeValue} has been ${this.barcodeId
      ? "updated"
      : "added"} in the database`);
    return response;
  },
};
