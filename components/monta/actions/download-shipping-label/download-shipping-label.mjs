import fs from "fs";
import monta from "../../monta.app.mjs";

export default {
  key: "monta-download-shipping-label",
  name: "Download Shipping Label",
  description: "Download a single shipping label file for an order and save it to the `/tmp` directory. Get the file name from **List Shipping Labels**, or generate labels first with **Create Shipping Label**. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1shippinglabels~1%7Bfilename%7D/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The shipping label file name. Use the **List Shipping Labels** action to find available file names.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const data = await this.monta.downloadShippingLabel({
      $,
      orderId: this.orderId,
      filename: this.filename,
      responseType: "arraybuffer",
    });

    const outputFilename = this.filename.split("/").pop();
    const path = `/tmp/${outputFilename}`;
    fs.writeFileSync(path, Buffer.from(data));

    $.export("$summary", `Successfully downloaded shipping label \`${outputFilename}\` for order \`${this.orderId}\``);

    return {
      path,
      filename: outputFilename,
    };
  },
};
