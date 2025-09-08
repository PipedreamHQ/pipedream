// legacy_hash_id: a_xqigGY
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-xero-create-purchase-bill",
  name: "Create Purchase Bill",
  description: "Creates a new purchase bill.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    contact_id: {
      type: "string",
      description: "Id of the contact associated to the invoice.",
      optional: true,
    },
    contact_name: {
      type: "string",
      description: "Name of the contact associated to the invoice. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    line_items: {
      type: "any",
      description: "See [LineItems](https://developer.xero.com/documentation/api/invoices#LineItemsPOST). The LineItems collection can contain any number of individual LineItem sub-elements. At least * **one** * is required to create a complete Invoice.",
    },
    date: {
      type: "string",
      description: "Date invoice was issued - YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation.",
      optional: true,
    },
    due_date: {
      type: "string",
      description: "Date invoice is due - YYYY-MM-DD.",
      optional: true,
    },
    line_amount_type: {
      type: "string",
      description: "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)",
      optional: true,
    },
    purchase_bill_number: {
      type: "string",
      description: "Non-unique alpha numeric code identifying purchase bill (printable ASCII characters only). This value will also display as Reference in the UI.",
      optional: true,
    },
    reference: {
      type: "string",
      description: "Additional reference number (max length = 255)",
      optional: true,
    },
    branding_theme_id: {
      type: "string",
      description: "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
      optional: true,
    },
    url: {
      type: "string",
      description: "URL link to a source document - shown as \"Go to [appName]\" in the Xero app",
      optional: true,
    },
    currency_code: {
      type: "string",
      description: "The currency that invoice has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies))",
      optional: true,
    },
    currency_rate: {
      type: "string",
      description: "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used. (max length = [18].[6])",
      optional: true,
    },
    status: {
      type: "string",
      description: "See [Invoice Status Codes](https://developer.xero.com/documentation/api/invoices#status-codes)",
      optional: true,
    },
    sent_to_contact: {
      type: "string",
      description: "Boolean to set whether the invoice in the Xero app should be marked as \"sent\". This can be set only on invoices that have been approved",
      optional: true,
    },
    planned_payment_date: {
      type: "string",
      description: "Shown on purchase bills (Accounts Payable) when this has been set",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/invoices#post

    if ((!this.contact_id && !this.contact_name) || !this.tenant_id || !this.line_items) {
      throw new Error("Must provide one of contact_id or contact_name, and tenant_id, type, line_items parameters.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.xero.com/api.xro/2.0/Invoices",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data: {
        Type: "ACCPAY", //ACCPAY = Purchase Bill
        Contact: {
          ContactID: this.contact_id,
          Name: this.contact_name,
        },
        LineItems: this.line_items,
        Date: this.date,
        DueDate: this.due_date,
        LineAmountTypes: this.line_amount_type,
        InvoiceNumber: this.purchase_bill_number,
        Reference: this.reference,
        BrandingThemeID: this.branding_theme_id,
        Url: this.url,
        CurrencyCode: this.currency_code,
        CurrencyRate: this.currency_rate,
        Status: this.status,
        SentToContact: this.sent_to_contact,
        PlannedPaymentDate: this.planned_payment_date,
      },
    });
  },
};
