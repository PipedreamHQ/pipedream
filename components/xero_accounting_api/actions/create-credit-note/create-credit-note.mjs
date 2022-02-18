// legacy_hash_id: a_3Lieoo
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-create-credit-note",
  name: "Create Credit Note",
  description: "Creates a new credit note.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    contact_id: {
      type: "string",
      description: "Id of the contact associated to the credit note.",
      optional: true,
    },
    contact_name: {
      type: "string",
      description: "Name of the contact associated to the credit note. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    contact_number: {
      type: "string",
      description: "Number of the contact associated to the credit note. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    type: {
      type: "string",
      description: "See [Credit Note Types](https://developer.xero.com/documentation/api/types#CreditNoteTypes)",
      options: [
        "ACCPAYCREDIT",
        "ACCRECCREDIT",
      ],
    },
    date: {
      type: "string",
      description: "The date the credit note is issued YYYY-MM-DD. If the Date element is not specified then it will default to the current date based on the timezone setting of the organisation",
      optional: true,
    },
    status: {
      type: "string",
      description: "See [Credit Note Status Codes](https://developer.xero.com/documentation/api/types#CreditNoteStatuses)",
      optional: true,
      options: [
        "DRAFT",
        "SUBMITTED",
        "DELETED",
        "AUTHORISED",
        "PAID",
        "VOIDED",
      ],
    },
    line_amount_types: {
      type: "string",
      description: "See [Invoice Line Amount Types](https://developer.xero.com/documentation/api/Types#LineAmountTypes)",
      optional: true,
      options: [
        "Exclusive",
        "Inclusive",
        "NoTax",
      ],
    },
    line_items: {
      type: "object",
      description: "See [Invoice Line Items](https://developer.xero.com/documentation/api/Invoices#LineItems)",
      optional: true,
    },
    currency_code: {
      type: "string",
      description: "Currency used for the Credit Note",
      optional: true,
    },
    credit_note_number: {
      type: "string",
      description: "[ACCRECCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - Unique alpha numeric code identifying credit note ( *when missing will auto-generate from your Organisation Invoice Settings*)\n[ACCPAYCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - non-unique alpha numeric code identifying credit note. This value will also display as Reference in the UI.",
      optional: true,
    },
    reference: {
      type: "string",
      description: "ACCRECCREDIT only - additional reference number",
      optional: true,
    },
    sent_to_contact: {
      type: "boolean",
      description: "Boolean to indicate if a credit note has been sent to a contact via the Xero app (currently read only)",
      optional: true,
    },
    currency_rate: {
      type: "string",
      description: "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used",
      optional: true,
    },
    branding_theme_id: {
      type: "string",
      description: "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/credit-notes#POST

    if ((!this.contact_id && !this.contact_name && !this.contact_number) || !this.tenant_id || !this.type) {
      throw new Error("Must provide one of contact_id or contact_name or contact_number, and tenant_id, type parameters.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.xero.com/api.xro/2.0/CreditNotes",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data: {
        Type: this.type,
        Contact: {
          ContactID: this.contact_id,
          ContactNumber: this.contact_number,
          Name: this.contact_name,
        },
        Date: this.date,
        Status: this.status,
        LineAmountTypes: this.line_amount_types,
        LineItems: this.line_items,
        CurrencyCode: this.currency_code,
        CreditNoteNumber: this.credit_note_number,
        Reference: this.reference,
        SentToContact: this.sent_to_contact,
        CurrencyRate: this.currency_rate,
        BrandingThemeID: this.branding_theme_id,
      },
    });
  },
};
