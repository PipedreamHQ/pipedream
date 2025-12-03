import app from "../../netsuite.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "netsuite-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-invoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: false,
  },
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    tranDate: {
      type: "string",
      label: "Transaction Date",
      description: "The posting date of this invoice (format: `YYYY-MM-DD`). Defaults to today's date if not specified.",
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
      customerId,
      tranDate,
      subsidiaryId,
      items,
      memo,
      otherRefNum,
      additionalFields,
      replace,
      propertyNameValidation,
      propertyValueValidation,
    } = this;

    const response = await app.createInvoice({
      $,
      headers: {
        "X-NetSuite-PropertyNameValidation": propertyNameValidation,
        "X-NetSuite-PropertyValueValidation": propertyValueValidation,
      },
      params: {
        replace,
      },
      data: {
        entity: {
          id: customerId,
        },
        tranDate,
        ...(subsidiaryId && {
          subsidiary: {
            id: subsidiaryId,
          },
        }),
        ...(items && {
          item: {
            items: utils.parseJson(items),
          },
        }),
        memo,
        otherRefNum,
        ...(additionalFields && utils.parseJson(additionalFields)),
      },
    });

    $.export("$summary", "Successfully created invoice");
    return response;
  },
};
