import { ConfigurationError } from "@pipedream/platform";
import { formatLineItems } from "../../common/util.mjs";
import xero from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-xero-create-sales-invoice",
  name: "Create Sales Invoice",
  description: "Creates a new sales invoice. [See the documentation](https://developer.xero.com/documentation/api/invoices#post)",
  version: "0.3.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xero,
    tenantId: {
      propDefinition: [
        xero,
        "tenantId",
      ],
    },
    contactId: {
      type: "string",
      label: "Contact",
      description: "Id of the contact associated to the invoice.",
      async options() {
        if (!this.tenantId) {
          return [];
        }
        const { Contacts: contacts } = await this.xero.getContact({
          tenantId: this.tenantId,
        });
        return contacts?.map(({
          ContactID: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Name of the contact associated to the invoice. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    lineItems: {
      propDefinition: [
        xero,
        "lineItems",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date invoice was issued - YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date invoice is due - YYYY-MM-DD.",
      optional: true,
    },
    lineAmountType: {
      type: "string",
      label: "Line Amount Type",
      description: "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)",
      optional: true,
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "Unique alpha numeric code identifying invoice (* when missing will auto-generate from your Organisation Invoice Settings*) (max length = 255)",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Additional reference number (max length = 255)",
      optional: true,
    },
    brandingThemeId: {
      type: "string",
      label: "Branding Theme ID",
      description: "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL link to a source document - shown as \"Go to [appName]\" in the Xero app",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The currency that invoice has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies))",
      optional: true,
    },
    currencyRate: {
      type: "string",
      label: "Currency Rate",
      description: "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used. (max length = [18].[6])",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "See [Invoice Status Codes](https://developer.xero.com/documentation/api/invoices#status-codes)",
      optional: true,
    },
    sentToContact: {
      type: "string",
      label: "Sent To Contact",
      description: "Boolean to set whether the invoice in the Xero app should be marked as \"sent\". This can be set only on invoices that have been approved",
      optional: true,
    },
    expectedPaymentData: {
      type: "string",
      label: "Expected Payment Date",
      description: "Shown on the sales invoices when this has been set",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.contactId && !this.contactName) || !this.tenantId || !this.lineItems) {
      throw new ConfigurationError("Must provide one of **Contact ID** or **Contact Name**, **Tenant ID**, **Type**, and **Line Items** parameters.");
    }

    const response = await this.xero.createInvoice({
      $,
      tenantId: this.tenantId,
      data: {
        Type: "ACCREC", //ACCREC = Sales Invoice
        Contact: {
          ContactID: this.contactId,
          Name: this.contactName,
        },
        LineItems: formatLineItems(this.lineItems),
        Date: this.date,
        DueDate: this.dueDate,
        LineAmountTypes: this.lineAmountType,
        InvoiceNumber: this.invoiceNumber,
        Reference: this.reference,
        BrandingThemeID: this.brandingThemeId,
        Url: this.url,
        CurrencyCode: this.currencyCode,
        CurrencyRate: this.currencyRate,
        Status: this.status,
        SentToContact: this.sentToContact,
        ExpectedPaymentDate: this.expectedPaymentData,
      },
    });

    return response;
  },
};
