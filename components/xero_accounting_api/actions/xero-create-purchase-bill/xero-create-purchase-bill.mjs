import { ConfigurationError } from "@pipedream/platform";
import { formatLineItems } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-xero-create-purchase-bill",
  name: "Create Purchase Bill",
  description: "Creates a new purchase bill.",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    contactId: {
      label: "Contact ID",
      type: "string",
      description: "Id of the contact associated to the invoice.",
      optional: true,
    },
    contactName: {
      label: "Contact Name",
      type: "string",
      description: "Name of the contact associated to the invoice. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    lineItems: {
      label: "Line Items",
      type: "any",
      description: "See [LineItems](https://developer.xero.com/documentation/api/invoices#LineItemsPOST). The LineItems collection can contain any number of individual LineItem sub-elements. At least * **one** * is required to create a complete Invoice.",
    },
    date: {
      label: "Date",
      type: "string",
      description: "Date invoice was issued - YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation.",
      optional: true,
    },
    dueDate: {
      label: "Due Date",
      type: "string",
      description: "Date invoice is due - YYYY-MM-DD.",
      optional: true,
    },
    lineAmountType: {
      label: "Line Amount Type",
      type: "string",
      description: "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)",
      optional: true,
    },
    purchaseBillNumber: {
      label: "Purchase Bill Number",
      type: "string",
      description: "Non-unique alpha numeric code identifying purchase bill (printable ASCII characters only). This value will also display as Reference in the UI.",
      optional: true,
    },
    reference: {
      label: "Reference",
      type: "string",
      description: "Additional reference number (max length = 255)",
      optional: true,
    },
    brandingThemeId: {
      label: "Branding Theme ID",
      type: "string",
      description: "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
      optional: true,
    },
    url: {
      label: "URL",
      type: "string",
      description: "URL link to a source document - shown as \"Go to [appName]\" in the Xero app",
      optional: true,
    },
    currencyCode: {
      label: "Currency Code",
      type: "string",
      description: "The currency that invoice has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies))",
      optional: true,
    },
    currencyRate: {
      label: "Currency Rate",
      type: "string",
      description: "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used. (max length = [18].[6])",
      optional: true,
    },
    status: {
      label: "Status",
      type: "string",
      description: "See [Invoice Status Codes](https://developer.xero.com/documentation/api/invoices#status-codes)",
      optional: true,
    },
    sentToContact: {
      label: "Sent to Contact",
      type: "string",
      description: "Boolean to set whether the invoice in the Xero app should be marked as \"sent\". This can be set only on invoices that have been approved",
      optional: true,
    },
    plannedPaymentDate: {
      label: "Planned Payment Date",
      type: "string",
      description: "Shown on purchase bills (Accounts Payable) when this has been set",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.contactId && !this.contactName) || !this.tenantId || !this.lineItems) {
      throw new ConfigurationError("Must provide one of **Contact ID** or **Contact Name**, **Tenant ID**, **Type**, and **Line Items** parameters.");
    }

    const response = await this.xeroAccountingApi.createInvoice({
      $,
      tenantId: this.tenantId,
      data: {
        Type: "ACCPAY", //ACCPAY = Purchase Bill
        Contact: {
          ContactID: this.contactId,
          Name: this.contactName,
        },
        LineItems: formatLineItems(this.lineItems),
        Date: this.date,
        DueDate: this.dueDate,
        LineAmountTypes: this.lineAmountType,
        InvoiceNumber: this.purchaseBillNumber,
        Reference: this.reference,
        BrandingThemeID: this.brandingThemeId,
        Url: this.url,
        CurrencyCode: this.currencyCode,
        CurrencyRate: this.currencyRate,
        Status: this.status,
        SentToContact: this.sentToContact,
        PlannedPaymentDate: this.plannedPaymentDate,
      },
    });

    $.export("$summary", `Successfully created purchase bill with ID: ${response.PurchaseBillID}`);
    return response;
  },
};
