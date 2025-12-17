import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import faktoora from "../../faktoora.app.mjs";

export default {
  key: "faktoora-get-invoice",
  name: "Download Invoice",
  description: "Download an invoice using the unique invoice number to '/tmp' folder. [See the documentation](https://api.faktoora.com/api/v1/api-docs/static/index.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    faktoora,
    invoiceNumber: {
      propDefinition: [
        faktoora,
        "invoiceNumber",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.faktoora.fetchInvoice({
        $,
        responseType: "arraybuffer",
        params: {
          invoiceNumber: this.invoiceNumber,
        },
      });

      const filePath = `/tmp/invoice-${this.invoiceNumber.replace(/\//g, "-")}.pdf`;
      fs.writeFileSync(filePath, response);

      $.export("$summary", `Successfully downloaded invoice with number: ${this.invoiceNumber}`);
      return filePath;
    } catch (e) {
      throw new ConfigurationError("Invoice not found.");
    }
  },
};
