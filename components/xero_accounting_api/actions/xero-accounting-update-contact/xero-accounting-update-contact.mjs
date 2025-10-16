import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-xero-accounting-update-contact",
  name: "Update Contact",
  description: "Updates a contact given its identifier.",
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
      description: "Contact identifier of the contact to update.",
    },
    name: {
      label: "Name",
      type: "string",
      description: "Full name of contact/organisation (max length = 255). The following is required to create a contact.",
      optional: true,
    },
    contactNumber: {
      label: "Contact Number",
      type: "string",
      description: "This can be updated via the API only i.e. This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50). If the Contact Number is used, this is displayed as Contact Code in the Contacts UI in Xero.",
      optional: true,
    },
    accountNumber: {
      label: "Account Number",
      type: "string",
      description: "A user defined account number. This can be updated via the API and the [Xero UI](https://help.xero.com/ContactsAccountNumber) (max length = 50).",
      optional: true,
    },
    contactStatus: {
      label: "Contact Status",
      type: "string",
      description: "Current status of a contact - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)",
      optional: true,
      options: [
        "ACTIVE",
        "ARCHIVED",
        "GDPRREQUEST",
      ],
    },
    firstName: {
      label: "First Name",
      type: "string",
      description: "First name of contact person (max length = 255).",
      optional: true,
    },
    lastName: {
      label: "Last Name",
      type: "string",
      description: "Last name of contact person (max length = 255)",
      optional: true,
    },
    emailAddress: {
      label: "Email Address",
      type: "string",
      description: "Email address of contact person (umlauts not supported) (max length = 255)",
      optional: true,
    },
    skypeUserName: {
      label: "Skype User Name",
      type: "string",
      description: "Skype user name of contact.",
      optional: true,
    },
    contactPersons: {
      label: "Contact Persons",
      type: "any",
      description: "See [contact persons](https://developer.xero.com/documentation/api/contacts#contact-persons).",
      optional: true,
    },
    bankAccountDetails: {
      label: "Bank Account Details",
      type: "string",
      description: "Bank account number of contact",
      optional: true,
    },
    taxNumber: {
      label: "Tax Number",
      type: "string",
      description: "Tax number of contact - this is also known as the ABN (Australia), GST Number (New Zealand), VAT Number (UK) or Tax ID Number (US and global) in the Xero UI depending on which regionalized version of Xero you are using (max length = 50)",
      optional: true,
    },
    accountReceivableTaxType: {
      label: "Account Receivable Tax Type",
      type: "string",
      description: "Default tax type used for contact on AP invoices",
      optional: true,
    },
    accountPayableType: {
      label: "Account Payable Type",
      type: "string",
      description: "Store certain address types for a contact - see address types",
      optional: true,
    },
    addresses: {
      label: "Addresses",
      type: "any",
      description: "Store certain address types for a contact - see address types",
      optional: true,
    },
    phones: {
      label: "Phones",
      type: "any",
      description: "Store certain phone types for a contact - see phone types.",
      optional: true,
    },
    isSupplier: {
      label: "Is Supplier",
      type: "boolean",
      description: "true or false  Boolean that describes if a contact that has any AP invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts payable invoice is generated against this contact.",
      optional: true,
    },
    isCustomer: {
      label: "Is Customer",
      type: "boolean",
      description: "true or false  Boolean that describes if a contact has any AR invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts receivable invoice is generated against this contact.",
      optional: true,
    },
    defaultCurrency: {
      label: "Default Currency",
      type: "string",
      description: "Default currency for raising invoices against contact",
      optional: true,
    },
    xeroNetworkKey: {
      label: "Xero Network Key",
      type: "string",
      description: "Store XeroNetworkKey for contacts.",
      optional: true,
    },
    salesDefaultAccountCode: {
      label: "Sales Default Account Code",
      type: "string",
      description: "The default sales [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
      optional: true,
    },
    puchasesDefaultAccountCode: {
      label: "Purchases Default Account Code",
      type: "string",
      description: "The default purchases [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
      optional: true,
    },
    salesTrackingCategories: {
      label: "Sales Tracking Categories",
      type: "string",
      description: "The default sales [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
      optional: true,
    },
    puechasesTrackingCategories: {
      label: "Purchases Tracking Categories",
      type: "string",
      description: "The default purchases [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
      optional: true,
    },
    trackingCategoryName: {
      label: "Tracking Category Name",
      type: "string",
      description: "The name of the Tracking Category assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
      optional: true,
    },
    trackingOptionName: {
      label: "Tracking Option Name",
      type: "string",
      description: "The name of the Tracking Option assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
      optional: true,
    },
    paymentTermsBillDay: {
      label: "Payment Terms Bill Day",
      type: "integer",
      description: "The default payment terms bill day",
      optional: true,
    },
    paymentTermsBillType: {
      type: "string",
      label: "Payment Terms Bill Type",
      description: "The default payment terms bill type",
      optional: true,
      options: [
        {
          "label": "day(s) after bill date",
          "value": "DAYSAFTERBILLDATE",
        },
        {
          "label": "day(s) after bill month",
          "value": "DAYSAFTERBILLMONTH",
        },
        {
          "label": "of the current month",
          "value": "OFCURRENTMONTH",
        },
        {
          "label": "of the following month",
          "value": "OFFOLLOWINGMONTH",
        },
      ],
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.contactId) {
      throw new ConfigurationError("Must provide **Tenant ID**, and **Contact ID** parameters.");
    }

    const response = await this.xeroAccountingApi.updateContact({
      $,
      tenantId: this.tenantId,
      contactId: this.contactId,
      data: {
        Name: this.name,
        ContactID: this.contactId,
        ContactNumber: this.contactNumber,
        AccountNumber: this.accountNumber,
        ContactStatus: this.contactStatus,
        FirstName: this.firstName,
        LastName: this.lastName,
        EmailAddress: this.emailAddress,
        SkypeUserName: this.skypeUserName,
        ContactPersons: parseObject(this.contactPersons),
        BankAccountDetails: this.bankAccountDetails,
        TaxNumber: this.taxNumber,
        AccountsReceivableTaxType: this.accountReceivableTaxType,
        AccountsPayableTaxType: this.accountPayableType,
        Addresses: parseObject(this.addresses),
        Phones: parseObject(this.phones),
        IsSupplier: this.isSupplier,
        IsCustomer: this.isCustomer,
        DefaultCurrency: this.defaultCurrency,
        XeroNetworkKey: this.xeroNetworkKey,
        SalesDefaultAccountCode: this.salesDefaultAccountCode,
        PurchasesDefaultAccountCode: this.puchasesDefaultAccountCode,
        SalesTrackingCategories: this.salesTrackingCategories,
        PurchasesTrackingCategories: this.puechasesTrackingCategories,
        TrackingCategoryName: this.trackingCategoryName,
        TrackingOptionName: this.trackingOptionName,
        PaymentTerms: {
          Bills: {
            Day: this.paymentTermsBillDay,
            Type: this.paymentTermsBillType,
          },
        },
      },
    });

    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
