import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import {
  checkTmp, parseObject,
} from "../../common/utils.mjs";
import theBookie from "../../the_bookie.app.mjs";

export default {
  key: "the_bookie-create-sales-invoice",
  name: "Create Sales Invoice",
  description: "Creates a new sales invoice. [See the documentation](https://app.thebookie.nl/nl/help/article/api-documentatie/#salesentry_create)",
  version: "0.0.1",
  type: "action",
  props: {
    theBookie,
    contactId: {
      propDefinition: [
        theBookie,
        "contactId",
      ],
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The number of the invoice",
    },
    invoiceDate: {
      type: "string",
      label: "Invoice Date",
      description: "The date of the invoice. **Format: YYYY-MM-DD**",
    },
    expirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "The expiration date of the invoice. **Format: YYYY-MM-DD**",
    },
    btwShifted: {
      type: "string",
      label: "VAT shifted",
      description: "The VAT type",
      options: [
        {
          label: "No (standard)",
          value: "NONE",
        },
        {
          label: "Shifted within The Netherlands",
          value: "NL",
        },
        {
          label: "Shifted within EU",
          value: "EU",
        },
        {
          label: "Shifted outside EU",
          value: "NON_EU",
        },
      ],
      optional: true,
    },
    journalEntryLines: {
      type: "string[]",
      label: "Journal Entry Lines",
      description: "An array of stringified objects of item entry lines. **Example: { \"description\": \"Boekregel 1\", \"btw_type\": \"PROCENT_21\", \"amount\": \"1200.0\", \"quantity\": \"2.00\"}** btw_type can be only 'PERCENT_9', 'PERCENT_21' or 'PERCENT_0'",
      optional: true,
    },
    attachment: {
      type: "string",
      label: "Attachment",
      description: "The path to the pdf file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.journalEntryLines) {
      throw new ConfigurationError("At least one (1) 'Journal Entry Line' should be added");
    }
    if (this.attachment) {
      this.attachment = fs.readFileSync(checkTmp(this.attachment), {
        encoding: "base64",
      });
    }
    const response = await this.theBookie.createInvoice({
      $,
      data: {
        contact_id: this.contactId,
        invoice_number: this.invoiceNumber,
        invoice_date: this.invoiceDate,
        expiration_date: this.expirationDate,
        btw_shifted: this.btwShifted,
        journal_entry_lines: parseObject(this.journalEntryLines),
        attachment: this.attachment,
      },
    });

    $.export("$summary", `Successfully created invoice with number ${this.invoiceNumber}`);
    return response;
  },
};
