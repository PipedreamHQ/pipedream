import fortnox from "../../fortnox.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "fortnox-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in the Fortnox API. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Invoices/operation/create_23).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fortnox,
    customerNumber: {
      propDefinition: [
        fortnox,
        "customerNumber",
      ],
    },
    address1: {
      propDefinition: [
        fortnox,
        "address1",
      ],
    },
    address2: {
      propDefinition: [
        fortnox,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        fortnox,
        "city",
      ],
    },
    zipCode: {
      propDefinition: [
        fortnox,
        "zipCode",
      ],
    },
    country: {
      propDefinition: [
        fortnox,
        "country",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the invoice",
      optional: true,
    },
    invoiceRows: {
      type: "string[]",
      label: "Invoice Rows",
      description: "An array of invoice row objects. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Invoices/operation/create_23) for invoice row properties.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the invoice",
      options: [
        "INVOICE",
        "AGREEMENTINVOICE",
        "INTRESTINVOICE",
        "SUMMARYINVOICE",
        "CASHINVOICE",
      ],
      optional: true,
    },
    emailAddressFrom: {
      type: "string",
      label: "Email Address From",
      description: "The email address to send the invoice from",
      optional: true,
    },
    emailAddressTo: {
      type: "string",
      label: "Email Address To",
      description: "The email address to send the invoice to",
      optional: true,
    },
    emailSubject: {
      type: "string",
      label: "Email Subject",
      description: "The subject of the email",
      optional: true,
    },
    emailBody: {
      type: "string",
      label: "Email Body",
      description: "The body of the email",
      optional: true,
    },
    freight: {
      type: "string",
      label: "Freight",
      description: "The freight of the invoice",
      optional: true,
    },
    termsOfDelivery: {
      type: "string",
      label: "Terms of Delivery",
      description: "The terms of delivery of the invoice",
      optional: true,
    },
    termsOfPayment: {
      type: "string",
      label: "Terms of Payment",
      description: "The terms of payment of the invoice",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fortnox.createInvoice({
      $,
      data: {
        Invoice: {
          CustomerNumber: this.customerNumber,
          Address1: this.address1,
          Address2: this.address2,
          City: this.city,
          ZipCode: this.zipCode,
          Country: this.country,
          DueDate: this.dueDate,
          InvoiceRows: this.invoiceRows && parseObject(this.invoiceRows),
          InvoiceType: this.type,
          EmailInformation:
            (this.emailAddressFrom || this.emailAddressTo || this.emailSubject || this.emailBody)
            && {
              EmailAddressFrom: this.emailAddressFrom,
              EmailAddressTo: this.emailAddressTo,
              EmailSubject: this.emailSubject,
              EmailBody: this.emailBody,
            },
          Freight: this.freight
            ? +this.freight
            : undefined,
          TermsOfDelivery: this.termsOfDelivery,
          TermsOfPayment: this.termsOfPayment,
        },
      },
    });
    $.export("$summary", `Successfully created invoice with ID \`${response.Invoice.InvoiceNumber}\``);
    return response;
  },
};
