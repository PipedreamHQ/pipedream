import app from "../../barcode_lookup.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "barcode_lookup-batch-barcode-lookup",
  name: "Batch Barcode Lookup",
  description: "Get multiple products by barcode. [See the documentation](https://www.barcodelookup.com/api-documentation)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    barcodes: {
      type: "string[]",
      label: "Barcodes",
      description: "The barcodes to search for. You can also use a partial barcode followed by an asterisk (*).",
    },
  },
  async run({ $ }) {
    const response = await this.app.getProducts({
      $,
      params: {
        barcode: parseObject(this.barcodes)?.join(","),
      },
    });
    $.export("$summary", "Successfully retrieved products by barcodes");
    return response;
  },
};
