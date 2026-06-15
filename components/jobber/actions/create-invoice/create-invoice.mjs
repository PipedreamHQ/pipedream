import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "jobber-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice within Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jobber,
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
    },
    taxCalculationMethod: {
      type: "string",
      label: "Tax Calculation Method",
      description: "Whether tax is applied on top of (`EXCLUSIVE`) or already included in (`INCLUSIVE`) line item prices",
      options: [
        "EXCLUSIVE",
        "INCLUSIVE",
      ],
    },
    taxRateId: {
      type: "string",
      label: "Tax Rate ID",
      description: "The ID of the tax rate to apply to the invoice",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date the invoice is due, in ISO 8601 format (e.g. `2026-07-01T00:00:00Z`)",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the invoice",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message to display on the invoice",
      optional: true,
    },
    numLineItems: {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to add to this invoice",
      min: 1,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.numLineItems) {
      return props;
    }
    for (let i = 1; i <= this.numLineItems; i++) {
      props[`line_${i}_name`] = {
        type: "string",
        label: `Line Item ${i} - Name`,
      };
      props[`line_${i}_description`] = {
        type: "string",
        label: `Line Item ${i} - Description`,
        optional: true,
      };
      props[`line_${i}_quantity`] = {
        type: "string",
        label: `Line Item ${i} - Quantity`,
        optional: true,
      };
      props[`line_${i}_unitPrice`] = {
        type: "string",
        label: `Line Item ${i} - Unit Price`,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      clientId,
      taxCalculationMethod,
      taxRateId,
      dueDate,
      subject,
      message,
      numLineItems,
    } = this;

    const lineItems = [];
    for (let i = 1; i <= numLineItems; i++) {
      const parts = [
        `name: "${this[`line_${i}_name`]}"`,
        this[`line_${i}_description`] && `description: "${this[`line_${i}_description`]}"`,
        this[`line_${i}_quantity`] && `quantity: ${this[`line_${i}_quantity`]}`,
        this[`line_${i}_unitPrice`] && `unitPrice: ${this[`line_${i}_unitPrice`]}`,
      ].filter(Boolean).join(", ");
      lineItems.push(`{${parts}}`);
    }

    const tax = [
      `taxCalculationMethod: ${taxCalculationMethod}`,
      taxRateId && `taxRateId: "${taxRateId}"`,
    ].filter(Boolean).join(", ");

    const dueDetails = dueDate
      ? `dueDate: "${dueDate}"`
      : "";

    const input = [
      `clientId: "${clientId}"`,
      subject && `subject: "${subject}"`,
      message && `message: "${message}"`,
      `tax: {${tax}}`,
      `dueDetails: {${dueDetails}}`,
      `lineItems: [${lineItems.join(", ")}]`,
    ].filter(Boolean).join(", ");

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateInvoice {
          invoiceCreate(input: {${input}}) {
            invoice {
              id
              invoiceNumber
            }
            userErrors {
              message
            }
          }
        }`,
        operationName: "CreateInvoice",
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    const userErrors = response.data?.invoiceCreate?.userErrors;
    if (userErrors?.length) {
      throw new ConfigurationError(userErrors[0].message);
    }
    $.export("$summary", `Successfully created invoice with ID ${response.data.invoiceCreate.invoice.id}`);
    return response;
  },
};
