import app from "../../codeclassify.app.mjs";

export default {
  key: "codeclassify-validate-gtin",
  name: "Validate Barcodes (GTIN/UPC/EAN)",
  description: "Validate one or more GTIN/UPC/EAN barcodes with the GS1 Mod-10 check digit. [See the docs](https://code-classify.com/api/).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    codes: {
      type: "string[]",
      label: "Barcodes",
      description: "One or more GTIN-8/UPC-A/EAN-13/GTIN-14 barcodes, e.g. `4006381333931`. Up to 100 per call.",
    },
  },
  async run({ $ }) {
    const response = await this.app.validateGtin({
      $,
      data: {
        codes: this.codes,
      },
    });
    $.export("$summary", `Validated ${this.codes.length} barcode${this.codes.length === 1 ? "" : "s"}`);
    return response;
  },
};
