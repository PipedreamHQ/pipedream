import app from "../../sperse.app.mjs";
import { parseArray } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "sperse-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Sperse. [See the documentation](https://app.sperse.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the invoice",
      options: constants.INVOICE_STATUS,
    },
    date: {
      type: "string",
      label: "Invoice Date",
      description: "The date of the invoice in ISO 8601 format (e.g., `2026-02-16`)",
    },
    currencyId: {
      propDefinition: [
        app,
        "currencyId",
      ],
    },
    grandTotal: {
      type: "string",
      label: "Grand Total",
      description: "The grand total amount",
    },
    lines: {
      type: "string[]",
      label: "Invoice Lines",
      description: `An array of invoice line items. Either priceOptionId or unitId should be specified, productCode or description should be specified. [See the documentation](https://app.sperse.com/app/api/swagger)
  
**Example:**
\`\`\`json
[
  {
    "productCode": "123",
    "unitId": "Day",
    "quantity": 1,
    "rate": 100,
    "total": 100,
    "sortOrder": 1
  }
]
\`\`\``,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the invoice in ISO 8601 format (e.g., `2026-10-15`)",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the invoice",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional notes for the invoice",
      optional: true,
    },
    taxTotal: {
      type: "string",
      label: "Tax Total",
      description: "The total tax amount",
      optional: true,
    },
    discountTotal: {
      type: "string",
      label: "Discount Total",
      description: "The total discount amount",
      optional: true,
    },
    shippingTotal: {
      type: "string",
      label: "Shipping Total",
      description: "The total shipping cost",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      contactId,
      currencyId,
      grandTotal,
      lines,
      date,
      dueDate,
      description,
      note,
      status,
      taxTotal,
      discountTotal,
      shippingTotal,
    } = this;

    const response = await app.createInvoice({
      $,
      data: {
        contactId,
        currencyId,
        grandTotal,
        lines: parseArray(lines),
        date,
        dueDate,
        description,
        note,
        status,
        taxTotal,
        discountTotal,
        shippingTotal,
      },
    });

    $.export("$summary", "Successfully created invoice.");

    return response;
  },
};
