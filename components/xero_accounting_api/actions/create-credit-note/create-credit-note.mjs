import { ConfigurationError } from "@pipedream/platform";
import { formatLineItems } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-create-credit-note",
  name: "Create Credit Note",
  description: "Creates a new credit note.",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
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
      description: "Id of the contact associated to the credit note.",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Name of the contact associated to the credit note. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "Number of the contact associated to the credit note. If there is no contact matching this name, a new contact is created.",
      optional: true,
    },
    type: {
      label: "Type",
      type: "string",
      description: "See [Credit Note Types](https://developer.xero.com/documentation/api/types#CreditNoteTypes)",
      options: [
        "ACCPAYCREDIT",
        "ACCRECCREDIT",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date the credit note is issued YYYY-MM-DD. If the Date element is not specified then it will default to the current date based on the timezone setting of the organisation",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
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
    lineAmountTypes: {
      label: "Line amount types",
      type: "string",
      description: "See [Invoice Line Amount Types](https://developer.xero.com/documentation/api/Types#LineAmountTypes)",
      optional: true,
      options: [
        "Exclusive",
        "Inclusive",
        "NoTax",
      ],
    },
    lineItems: {
      label: "Line items",
      type: "object",
      description: "See [Invoice Line Items](https://developer.xero.com/documentation/api/Invoices#LineItems)",
      optional: true,
    },
    currencyCode: {
      label: "Currency code",
      type: "string",
      description: "Currency used for the Credit Note",
      optional: true,
    },
    creditNoteNumber: {
      label: "Credit note number",
      type: "string",
      description: "[ACCRECCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - Unique alpha numeric code identifying credit note ( *when missing will auto-generate from your Organisation Invoice Settings*)\n[ACCPAYCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - non-unique alpha numeric code identifying credit note. This value will also display as Reference in the UI.",
      optional: true,
    },
    reference: {
      label: "Reference",
      type: "string",
      description: "ACCRECCREDIT only - additional reference number",
      optional: true,
    },
    sentToContact: {
      label: "Sent to contact",
      type: "boolean",
      description: "Boolean to indicate if a credit note has been sent to a contact via the Xero app (currently read only)",
      optional: true,
    },
    currencyRate: {
      label: "Currency rate",
      type: "string",
      description: "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used",
      optional: true,
    },
    brandingThemeId: {
      label: "Branding theme ID",
      type: "string",
      description: "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((
      !this.contactId &&
      !this.contactName &&
      !this.contactNumber) ||
      !this.tenantId ||
      !this.type) {
      throw new ConfigurationError("Must provide one of **Contact ID** or **Contact Name** or **Contact Number**, **Tenant ID**, and **Type** parameters.");
    }

    const response = await this.xeroAccountingApi.createCreditNote({
      $,
      tenantId: this.tenantId,
      data: {
        Type: this.type,
        Contact: {
          ContactID: this.contactId,
          ContactNumber: this.contactNumber,
          Name: this.contactName,
        },
        Date: this.date,
        Status: this.status,
        LineAmountTypes: this.lineAmountTypes,
        LineItems: formatLineItems(this.lineItems),
        CurrencyCode: this.currencyCode,
        CreditNoteNumber: this.creditNoteNumber,
        Reference: this.reference,
        SentToContact: this.sentToContact,
        CurrencyRate: this.currencyRate,
        BrandingThemeID: this.brandingThemeId,
      },
    });

    $.export("$summary", `Successfully created credit note with ID: ${response.CreditNotes[0].CreditNoteID}`);
    return response;
  },
};
