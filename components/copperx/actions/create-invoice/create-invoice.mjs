import {
  objectToArray, parseString,
} from "../../common/utils.mjs";
import copperx from "../../copperx.app.mjs";

export default {
  key: "copperx-create-invoice",
  name: "Create Invoice",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new invoice [See the documentation](https://copperx.readme.io/reference/invoicecontroller_create)",
  type: "action",
  props: {
    copperx,
    description: {
      type: "string",
      label: "Description",
      description: "The invoice's description.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "The invoice's custom fields.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The invoice's due date.",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer",
      description: "The additional invoice's footer.",
      optional: true,
    },
    fromInvoiceId: {
      type: "string",
      label: "From Invoice Id",
      description: "The invoice Id of this invoice is from.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The additional invoice's metadata.",
      optional: true,
    },
    clientReferenceId: {
      type: "string",
      label: "Client Reference Id.",
      description: "The client's reference Id.",
      optional: true,
    },
    customerId: {
      propDefinition: [
        copperx,
        "customerId",
      ],
      optional: true,
    },
    lineItems: {
      type: "string",
      label: "Line Items",
      description: "The line items to be used in checkout session [See the documentation to further information about the Line Items object](https://copperx.readme.io/reference/invoicecontroller_create).",
    },
    paymentSetting: {
      type: "string",
      label: "Payment Setting",
      description: "The list of chains allowed for the payment. If not provided, all chains supported by the organization are enabled. [See the documentation to further information about the Payment Settings object](https://copperx.readme.io/reference/invoicecontroller_create).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      copperx,
      customFields,
      lineItems,
      paymentSetting,
      ...data
    } = this;

    const response = await copperx.createInvoice({
      $,
      data: {
        customFields: customFields && objectToArray(customFields),
        lineItems: lineItems && parseString(lineItems),
        paymentSetting: paymentSetting && parseString(paymentSetting),
        ...data,
      },
    });

    $.export("$summary", `A new invoice with Id: ${response.id} was successfully created!`);
    return response;
  },
};
