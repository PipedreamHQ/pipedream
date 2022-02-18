// legacy_hash_id: a_dvinrY
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-xero-accounting-update-contact",
  name: "Update Contact",
  description: "Updates a contact given its identifier.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    contact_id: {
      type: "string",
      description: "Contact identifier of the contact to update.",
    },
    name: {
      type: "string",
      description: "Full name of contact/organisation (max length = 255). The following is required to create a contact.",
      optional: true,
    },
    contact_number: {
      type: "string",
      description: "This can be updated via the API only i.e. This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50). If the Contact Number is used, this is displayed as Contact Code in the Contacts UI in Xero.",
      optional: true,
    },
    account_number: {
      type: "string",
      description: "A user defined account number. This can be updated via the API and the [Xero UI](https://help.xero.com/ContactsAccountNumber) (max length = 50).",
      optional: true,
    },
    contact_status: {
      type: "string",
      description: "Current status of a contact - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)",
      optional: true,
      options: [
        "ACTIVE",
        "ARCHIVED",
        "GDPRREQUEST",
      ],
    },
    first_name: {
      type: "string",
      description: "First name of contact person (max length = 255).",
      optional: true,
    },
    last_name: {
      type: "string",
      description: "Last name of contact person (max length = 255)",
      optional: true,
    },
    email_address: {
      type: "string",
      description: "Email address of contact person (umlauts not supported) (max length = 255)",
      optional: true,
    },
    skype_user_name: {
      type: "string",
      description: "Skype user name of contact.",
      optional: true,
    },
    contact_persons: {
      type: "any",
      description: "See [contact persons](https://developer.xero.com/documentation/api/contacts#contact-persons).",
      optional: true,
    },
    bank_account_details: {
      type: "string",
      description: "Bank account number of contact",
      optional: true,
    },
    tax_number: {
      type: "string",
      description: "Tax number of contact - this is also known as the ABN (Australia), GST Number (New Zealand), VAT Number (UK) or Tax ID Number (US and global) in the Xero UI depending on which regionalized version of Xero you are using (max length = 50)",
      optional: true,
    },
    account_receivable_tax_type: {
      type: "string",
      description: "Default tax type used for contact on AP invoices",
      optional: true,
    },
    account_payable_type: {
      type: "string",
      description: "Store certain address types for a contact - see address types",
      optional: true,
    },
    addresses: {
      type: "any",
      description: "Store certain address types for a contact - see address types",
      optional: true,
    },
    phones: {
      type: "any",
      description: "Store certain phone types for a contact - see phone types.",
      optional: true,
    },
    is_supplier: {
      type: "boolean",
      description: "true or false  Boolean that describes if a contact that has any AP invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts payable invoice is generated against this contact.",
      optional: true,
    },
    is_customer: {
      type: "boolean",
      description: "true or false  Boolean that describes if a contact has any AR invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts receivable invoice is generated against this contact.",
      optional: true,
    },
    default_currency: {
      type: "string",
      description: "Default currency for raising invoices against contact",
      optional: true,
    },
    xero_network_key: {
      type: "string",
      description: "Store XeroNetworkKey for contacts.",
      optional: true,
    },
    sales_default_account_code: {
      type: "string",
      description: "The default sales [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
      optional: true,
    },
    puchases_default_account_code: {
      type: "string",
      description: "The default purchases [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
      optional: true,
    },
    sales_tracking_categories: {
      type: "string",
      description: "The default sales [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
      optional: true,
    },
    puechases_tracking_categories: {
      type: "string",
      description: "The default purchases [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
      optional: true,
    },
    tracking_category_name: {
      type: "string",
      description: "The name of the Tracking Category assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
      optional: true,
    },
    tracking_option_name: {
      type: "string",
      description: "The name of the Tracking Option assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
      optional: true,
    },
    payment_terms: {
      type: "string",
      description: "The default payment terms for the contact - see Payment Terms",
      optional: true,
      options: [
        "DAYSAFTERBILLDATE",
        "DAYSAFTERBILLMONTH",
        "OFCURRENTMONTH",
        "OFFOLLOWINGMONTH",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/contacts
  //on section POST Contacts

    if (!this.tenant_id || !this.contact_id) {
      throw new Error("Must provide tenant_id, and contact_id parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://api.xero.com/api.xro/2.0/Contacts/${this.contact_id}`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data: {
        Name: this.name,
        ContactID: this.contact_id,
        ContactNumber: this.contact_number,
        AccountNumber: this.account_number,
        ContactStatus: this.contact_status,
        FirstName: this.first_name,
        LastName: this.last_name,
        EmailAddress: this.email_address,
        SkypeUserName: this.skype_user_name,
        ContactPersons: this.contact_persons,
        BankAccountDetails: this.bank_account_details,
        TaxNumber: this.tax_number,
        AccountsReceivableTaxType: this.account_receivable_tax_type,
        AccountsPayableTaxType: this.account_payable_type,
        Addresses: this.addresses,
        Phones: this.phones,
        IsSupplier: this.is_supplier,
        IsCustomer: this.is_customer,
        DefaultCurrency: this.default_currency,
        XeroNetworkKey: this.xero_network_key,
        SalesDefaultAccountCode: this.sales_default_account_code,
        PurchasesDefaultAccountCode: this.puchases_default_account_code,
        SalesTrackingCategories: this.sales_tracking_categories,
        PurchasesTrackingCategories: this.puechases_tracking_categories,
        TrackingCategoryName: this.tracking_category_name,
        TrackingOptionName: this.tracking_option_name,
        PaymentTerms: this.payment_terms,
      },
    });
  },
};
