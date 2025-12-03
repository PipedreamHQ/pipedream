import app from "../../netsuite.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "netsuite-update-invoice",
  name: "Update Invoice",
  description: "Updates an existing invoice. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-invoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  props: {
    app,
    invoiceId: {
      propDefinition: [
        app,
        "invoiceId",
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      optional: true,
    },
    tranDate: {
      type: "string",
      label: "Transaction Date",
      description: "The posting date of this invoice (format: `YYYY-MM-DD`).",
      optional: true,
    },
    subsidiaryId: {
      propDefinition: [
        app,
        "subsidiaryId",
      ],
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: `Array of item objects to add to the invoice. Each item should be a JSON object with the following properties:

**Required:**
- \`item\` - Item ID or reference object (e.g., \`{ "id": "123" }\`)
- \`quantity\` - Quantity to invoice (number)

**Important Optional:**
- \`rate\` - Price per unit (number)
- \`amount\` - Total line amount (number, usually \`quantity * rate\`)
- \`description\` - Custom description for the line item (string)
- \`taxCode\` - Tax code ID or reference object

**Example:**
\`\`\`json
[
  {
    "item": { "id": "456" },
    "quantity": 2,
    "rate": 99.99,
    "amount": 199.98,
    "description": "Professional services",
    "taxCode": { "id": "5" }
  }
]
\`\`\``,
      optional: true,
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "A memo to describe this invoice.",
      optional: true,
    },
    otherRefNum: {
      type: "string",
      label: "PO/Reference Number",
      description: "Customer's purchase order number or other reference number.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include in the invoice as a JSON object. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html) for available fields.",
      optional: true,
    },
    replace: {
      propDefinition: [
        app,
        "replace",
      ],
    },
    replaceSelectedFields: {
      type: "boolean",
      label: "Replace Selected Fields",
      description: "If set to true, all fields that should be deleted in the update request, including body fields, must be included in the 'replace' query parameter",
      optional: true,
      default: false,
    },
    propertyNameValidation: {
      propDefinition: [
        app,
        "propertyNameValidation",
      ],
    },
    propertyValueValidation: {
      propDefinition: [
        app,
        "propertyValueValidation",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      invoiceId,
      customerId,
      tranDate,
      subsidiaryId,
      items,
      memo,
      otherRefNum,
      additionalFields,
      replace,
      replaceSelectedFields,
      propertyNameValidation,
      propertyValueValidation,
    } = this;

    const response = await app.updateInvoice({
      $,
      invoiceId,
      headers: {
        "X-NetSuite-PropertyNameValidation": propertyNameValidation,
        "X-NetSuite-PropertyValueValidation": propertyValueValidation,
      },
      params: {
        replace,
        replaceSelectedFields,
      },
      data: {
        ...(customerId && {
          entity: {
            id: customerId,
          },
        }),
        tranDate,
        ...(subsidiaryId && {
          subsidiary: {
            id: subsidiaryId,
          },
        }),
        ...items && {
          item: {
            items: utils.parseJson(items),
          },
        },
        memo,
        otherRefNum,
        ...additionalFields && utils.parseJson(additionalFields),
      },
    });

    $.export("$summary", `Successfully updated invoice with ID ${invoiceId}`);
    return response;
  },
};
