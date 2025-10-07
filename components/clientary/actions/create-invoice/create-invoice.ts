import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../app/clientary.app";

export default defineAction({
  key: "clientary-create-invoice",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Invoice",
  description: "Creates a new invoice. [See docs here](https://www.clientary.com/api/invoices)",
  type: "action",
  props: {
    app,
    date: {
      type: "string",
      label: "Invoice Date",
      description: "The date of the invoice, e.g. `2022/11/17`",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the invoice, e.g. `2022/12/17`",
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "Currency Code, e.g. `USD`, `EUR`",
    },
    number: {
      type: "string",
      label: "Number",
      description: "Invoice number. Must be unique, e.g. `101`",
      optional: true,
    },
    invoiceItemsAttributes: {
      type: "string",
      label: "Invoice Item Attributes",
      description: "Invoice items attributes. Must be a valid JSON Array string, e.g. `[ { \"title\": \"foo\", \"quantity\": 1, \"price\": 100 }, { \"title\": \"bar\", \"quantity\": 2, \"price\": 200 } ]`",
      optional: true,
    },
  },
  async run({ $ }) {
    let invoiceItemsAttributes;
    if (this.invoiceItemsAttributes) {
      try {
        invoiceItemsAttributes = JSON.parse(this.invoiceItemsAttributes);
      } catch (err) {
        throw new ConfigurationError("`Estimate Items Attributes` must be a valid JSON Array string");
      }
    }
    const response = await this.app.getRequestMethod("createInvoice")({
      $,
      data: {
        date: this.date,
        due_date: this.dueDate,
        currency_code: this.currencyCode,
        number: this.number,
        invoice_items_attributes: invoiceItemsAttributes,
      },
    });
    $.export("$summary", `Successfully created an invoice (ID: ${response.id})`);
    return response;
  },
});
