// legacy_hash_id: a_0Mi7vm
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-update-customer",
  name: "Update Customer",
  description: "Updates a customer.",
  version: "0.1.1",
  type: "action",
  props: {
    quickbooks: {
      type: "app",
      app: "quickbooks",
    },
    display_name: {
      type: "string",
      description: "The name of the person or organization as displayed. Must be unique across all Customer, Vendor, and Employee objects. Cannot be removed with sparse update. If not supplied, the system generates DisplayName by concatenating customer name components supplied in the request from the following list: `Title`, `GivenName`, `MiddleName`, `FamilyName`, and `Suffix`.",
      optional: true,
    },
    title: {
      type: "string",
      description: "Title of the person. This tag supports i18n, all locales. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, `Suffix`, or `FullyQualifiedName` attributes are required during update.",
      optional: true,
    },
    given_name: {
      type: "string",
      description: "Given name or first name of a person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object update.",
      optional: true,
    },
    middle_name: {
      type: "string",
      description: "Middle name of the person. The person can have zero or more middle names. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object update.",
      optional: true,
    },
    family_name: {
      type: "string",
      description: "Family name or the last name of the person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object update.",
      optional: true,
    },
    suffix: {
      type: "string",
      description: "Suffix of the name. For example, `Jr`. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object update.",
      optional: true,
    },
    customer_id: {
      type: "string",
      description: "Unique identifier for the customer object to be updated.",
    },
    sync_token: {
      type: "string",
      description: "Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its SyncToken is incremented. Attempts to modify an object specifying an older SyncToken fails. Only the latest version of the object is maintained by QuickBooks Online.",
    },
    sparse_update: {
      type: "string",
      description: "When set to `true`, sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched.",
    },
    primary_email_addr: {
      type: "string",
      description: "Primary email address.",
      optional: true,
    },
    resale_num: {
      type: "string",
      description: "Resale number or some additional info about the customer.",
      optional: true,
    },
    secondary_tax_identifier: {
      type: "string",
      description: "Also called UTR No. in ( UK ) , CST Reg No. ( IN ) also represents the tax registration number of the Person or Organization. This value is masked in responses, exposing only last five characters. For example, the ID of `123-45-6789` is returned as `XXXXXX56789`",
      optional: true,
    },
    ar_account_ref_value: {
      type: "string",
      description: "Id of the accounts receivable account to be used for this customer. Each customer must have his own AR account. Applicable for France companies, only. Available when endpoint is evoked with the minorversion=3 query parameter. Query the Account name list resource to determine the appropriate Account object for this reference, where Account.AccountType=Accounts Receivable. Use `Account.Id` from that object for `ARAccountRef.value`.",
      optional: true,
    },
    ar_account_ref_name: {
      type: "string",
      description: "Name of the accounts receivable account to be used for this customer. Each customer must have his own AR account. Applicable for France companies, only. Available when endpoint is evoked with the minorversion=3 query parameter. Query the Account name list resource to determine the appropriate Account object for this reference, where Account.AccountType=Accounts Receivable. Use `Account.Name` from that object for `ARAccountRef.name`.",
      optional: true,
    },
    default_tax_code_value: {
      type: "string",
      description: "Id of the default tax code associated with this Customer object. Reference is valid if `Customer.Taxable` is set to true; otherwise, it is ignored. If automated sales tax is enabled (`Preferences.TaxPrefs.PartnerTaxEnabled` is set to true) the default tax code is set by the system and can not be overridden. Query the `TaxCode` name list resource to determine the appropriate `TaxCode` object for this reference. Use `TaxCode.Id` from that object for `DefaultTaxCodeRef.value`.",
      optional: true,
    },
    default_tax_code_name: {
      type: "string",
      description: "Id of the default tax code associated with this Customer object. Reference is valid if `Customer.Taxable` is set to true; otherwise, it is ignored. If automated sales tax is enabled (`Preferences.TaxPrefs.PartnerTaxEnabled` is set to true) the default tax code is set by the system and can not be overridden. Query the `TaxCode` name list resource to determine the appropriate `TaxCode` object for this reference. Use `TaxCode.Name` from that object for `DefaultTaxCodeRef.name`.",
      optional: true,
    },
    preferred_delivery_method: {
      type: "string",
      description: "Preferred delivery method. Values are `Print`, `Email`, or `None`.",
      optional: true,
      options: [
        "Print",
        "Email",
        "None",
      ],
    },
    GSTIN: {
      type: "string",
      description: "GSTIN is an identification number assigned to every GST registered business.",
      optional: true,
    },
    sale_term_ref_value: {
      type: "string",
      description: "Id of a SalesTerm object associated with this Customer object. Query the Term name list resource to determine the appropriate Term object for this reference. Use `Term.Id` from that object for `SalesTermRef.value`.",
      optional: true,
    },
    sale_term_ref_name: {
      type: "string",
      description: "Name of a SalesTerm object associated with this Customer object. Query the Term name list resource to determine the appropriate Term object for this reference. Use `Term.Name` from that object for `SalesTermRef.name`.",
      optional: true,
    },
    customer_type_ref_value: {
      type: "string",
      description: "Id referencing to the customer type assigned to a customer. This field is only returned if the customer is assigned a customer type.",
      optional: true,
    },
    fax_free_form_number: {
      type: "string",
      description: "Specifies the fax number in free form.",
      optional: true,
    },
    business_number: {
      type: "string",
      description: "Also called, PAN (in India) is a code that acts as an identification for individuals, families and corporates, especially for those who pay taxes on their income.",
      optional: true,
    },
    bill_with_parent: {
      type: "boolean",
      description: "If true, this Customer object is billed with its parent. If false, or null the customer is not to be billed with its parent. This attribute is valid only if this entity is a Job or sub Customer.",
      optional: true,
    },
    currency_ref_value: {
      type: "string",
      description: "A three letter string representing the ISO 4217 code for the currency. For example, `USD`, `AUD`, `EUR`, and so on. This must be defined if multicurrency is enabled for the company.\nMulticurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to `true`. Read more about multicurrency support [here](https://developer.intuit.com/docs?RedirectID=MultCurrencies). Required if multicurrency is enabled for the company.",
      optional: true,
    },
    currency_ref_name: {
      type: "object",
      description: "The full name of the currency.",
      optional: true,
    },
    mobile_free_form_number: {
      type: "string",
      description: "Specifies the mobile phone number in free form.",
      optional: true,
    },
    job: {
      type: "boolean",
      description: "If true, this is a Job or sub-customer. If false or null, this is a top level customer, not a Job or sub-customer.",
      optional: true,
    },
    balance_with_job: {
      type: "string",
      description: "Cumulative open balance amount for the Customer (or Job) and all its sub-jobs. Cannot be written to QuickBooks.",
      optional: true,
    },
    primary_phone_free_form_number: {
      type: "string",
      description: "Specifies the primary phone number in free form.",
      optional: true,
    },
    open_balance_date: {
      type: "string",
      description: "Date of the Open Balance for the create operation. Write-on-create.",
      optional: true,
    },
    taxable: {
      type: "string",
      description: "If true, transactions for this customer are taxable. Default behavior with minor version 10 and above: true, if `DefaultTaxCodeRef` is defined or false if `TaxExemptionReasonId` is set.",
      optional: true,
    },
    alternate_phone_free_form_number: {
      type: "string",
      description: "Specifies the alternate phone number in free form.",
      optional: true,
    },
    parent_ref_value: {
      type: "string",
      description: "Id referencing to a Customer object that is the immediate parent of the Sub-Customer/Job in the hierarchical Customer:Job list. Required for the create operation if this object is a sub-customer or Job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` from that object for `ParentRef.value`.",
      optional: true,
    },
    parent_ref_name: {
      type: "string",
      description: "Name referencing to a Customer object that is the immediate parent of the Sub-Customer/Job in the hierarchical Customer:Job list. Required for the create operation if this object is a sub-customer or Job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Name` from that object for `ParentRef.name`.",
      optional: true,
    },
    notes: {
      type: "string",
      description: "Free form text describing the Customer.",
      optional: true,
    },
    web_addr: {
      type: "string",
      description: "Website address.",
      optional: true,
    },
    active: {
      type: "string",
      description: "If true, this entity is currently enabled for use by QuickBooks. If there is an amount in `Customer.Balance` when setting this Customer object to inactive through the QuickBooks UI, a CreditMemo balancing transaction is created for the amount.",
      optional: true,
    },
    balance: {
      type: "string",
      description: "Specifies the open balance amount or the amount unpaid by the customer. For the create operation, this represents the opening balance for the customer. When returned in response to the query request it represents the current open balance (unpaid amount) for that customer. Write-on-create.",
      optional: true,
    },
    ship_addr_id: {
      type: "string",
      description: "Unique identifier of the QuickBooks object for the shipping address, used for modifying the address. \nThe ShippingAddr object represents the default shipping address. If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:\n* `Line1` and `Line2` elements are populated with the customer name and company name.\n* Original `Line1` through `Line5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.",
      optional: true,
    },
    ship_addr_postal_code: {
      type: "string",
      description: "Postal code for the shipping address. For example, zip code for USA and Canada.",
      optional: true,
    },
    ship_addr_city: {
      type: "string",
      description: "City name for the shipping address.",
      optional: true,
    },
    ship_addr_country: {
      type: "string",
      description: "Country name. For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.",
      optional: true,
    },
    ship_addr_line5: {
      type: "string",
      description: "Fifth line of the shipping address.",
      optional: true,
    },
    ship_addr_line4: {
      type: "string",
      description: "Fourth line of the shipping address.",
      optional: true,
    },
    ship_addr_line3: {
      type: "string",
      description: "Third line of the shipping address.",
      optional: true,
    },
    ship_addr_line2: {
      type: "string",
      description: "Second line of the shipping address.",
      optional: true,
    },
    ship_addr_line1: {
      type: "string",
      description: "First line of the shipping address.",
      optional: true,
    },
    ship_addr_late: {
      type: "string",
      description: "Latitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      optional: true,
    },
    ship_addr_long: {
      type: "string",
      description: "Longitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      optional: true,
    },
    ship_addr_country_sub_division_code: {
      type: "string",
      description: "Region within a country for the shipping address. For example, state name for USA, province name for Canada.",
      optional: true,
    },
    payment_method_ref_value: {
      type: "string",
      description: "Id referencing a PaymentMethod object associated with this Customer object. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use `PaymentMethod.Id` from that object for `PaymentMethodRef.value`.",
      optional: true,
    },
    payment_method_ref_name: {
      type: "string",
      description: "Id referencing a PaymentMethod object associated with this Customer object. Query the PaymentMethod name list resource to determine the appropriate PaymentMethod object for this reference. Use `PaymentMethod.Name` from that object for `PaymentMethodRef.name`.",
      optional: true,
    },
    is_project: {
      type: "boolean",
      description: "If true, indicates this is a Project.",
      optional: true,
    },
    company_name: {
      type: "string",
      description: "The name of the company associated with the person or organization.",
      optional: true,
    },
    primary_tax_identifier: {
      type: "string",
      description: "Also called Tax Reg. No in ( UK ) , ( CA ) , ( IN ) , ( AU ) represents the tax ID of the Person or Organization. This value is masked in responses, exposing only last five characters. For example, the ID of `123-45-6789` is returned as `XXXXXX56789`.",
      optional: true,
    },
    gst_registration_type: {
      type: "string",
      description: "For the filing of GSTR, transactions need to be classified depending on the type of customer to whom the sale is done. To facilitate this, we have introduced a new field as 'GST registration type'.\nPossible values are listed below, for their description [See the API Docs](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer#full-update-a-customer).\n* `GST_REG_REG`\n* `GST_REG_COMP`\n* `GST_UNREG`\n* `CONSUMER`\n* `OVERSEAS`\n* `SEZ`\n* `DEEMED`",
      optional: true,
      options: [
        "GST_REG_REG",
        "GST_REG_COMP",
        "GST_UNREG",
        "CONSUMER",
        "OVERSEAS",
        "SEZ",
        "DEEMED",
      ],
    },
    print_on_check_name: {
      type: "string",
      description: "Name of the person or organization as printed on a check. If not provided, this is populated from DisplayName. Constraints: Cannot be removed with sparse update.",
      optional: true,
    },
    bill_addr_id: {
      type: "string",
      description: "Unique identifier of the QuickBooks object for the billing address, used for modifying the address. \nThe BillAddr object represents the default billing address. If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:\n* `Line1` and `Line2` elements are populated with the customer name and company name.\n* Original `Line1` through `Line5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.",
      optional: true,
    },
    bill_addr_postal_code: {
      type: "string",
      description: "Postal code for the billing address. For example, zip code for USA and Canada.",
      optional: true,
    },
    bill_addr_city: {
      type: "string",
      description: "City name for the billing address.",
      optional: true,
    },
    bill_addr_country: {
      type: "string",
      description: "Country name. For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.",
      optional: true,
    },
    bill_addr_line5: {
      type: "string",
      description: "Fifth line of the billing address.",
      optional: true,
    },
    bill_addr_line4: {
      type: "string",
      description: "Fourth line of the billing address.",
      optional: true,
    },
    bill_addr_line3: {
      type: "string",
      description: "Third line of the billing address.",
      optional: true,
    },
    bill_addr_line2: {
      type: "string",
      description: "Second line of the billing address.",
      optional: true,
    },
    bill_addr_line1: {
      type: "string",
      description: "First line of the billing address.",
      optional: true,
    },
    bill_addr_late: {
      type: "string",
      description: "Latitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      optional: true,
    },
    bill_addr_long: {
      type: "string",
      description: "Longitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      optional: true,
    },
    bill_addr_country_sub_division_code: {
      type: "string",
      description: "Region within a country for the billing address. For example, state name for USA, province name for Canada.",
      optional: true,
    },
    tax_exemption_reason_id: {
      type: "string",
      description: "The tax exemption reason associated with this customer object. Applicable if automated sales tax is enabled (`Preferences.TaxPrefs.PartnerTaxEnabled` is set to `true`) for the company. Set `TaxExemptionReasonId`: to one of the following:\n**Id\tReason**\n* 1\tFederal government\n* 2\tState government\n* 3\tLocal government\n* 4\tTribal government\n* 5\tCharitable organization\n* 6\tReligious organization\n* 7\tEducational organization\n* 8\tHospital\n* 9\tResale\n* 10\tDirect pay permit\n* 11\tMultiple points of use\n* 12\tDirect mail\n* 13\tAgricultural production\n* 14\tIndustrial production / manufacturing\n* 15\tForeign diplomat",
      optional: true,
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
      ],
    },
    minorversion: {
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Quickbooks API docs at: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer#full-update-a-customer

    if (!this.display_name && (!this.title && !this.given_name && !this.middle_name && !this.family_name && !this.suffix) || !this.customer_id || !this.sync_token || this.sparse_update === undefined) {
      throw new Error("Must provide display_name or at least one of title, given_name, middle_name, family_name, or suffix, and customer_id, sync_token parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/customer`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        sparse: this.sparse_update,
        Id: this.customer_id,
        DisplayName: this.display_name,
        Suffix: this.suffix,
        Title: this.title,
        MiddleName: this.middle_name,
        FamilyName: this.family_name,
        GivenName: this.given_name,
        SyncToken: this.sync_token,
        PrimaryEmailAddr: this.primary_email_addr,
        ResaleNum: this.resale_num,
        SecondaryTaxIdentifier: this.secondary_tax_identifier,
        ARAccountRef: {
          value: this.ar_account_ref_value,
          name: this.ar_account_ref_name,
        },
        DefaultTaxCodeRef: {
          value: this.default_tax_code_value,
          name: this.default_tax_code_name,
        },
        PreferredDeliveryMethod: this.preferred_delivery_method,
        GSTIN: this.GSTIN,
        SalesTermRef: {
          value: this.sale_term_ref_value,
          name: this.sale_term_ref_name,
        },
        CustomerTypeRef: {
          value: this.customer_type_ref_value,
        },
        Fax: {
          FreeFormNumber: this.fax_free_form_number,
        },
        BusinessNumber: this.business_number,
        BillWithParent: this.bill_with_parent,
        CurrencyRef: {
          value: this.currency_ref_value,
          name: this.currency_ref_name,
        },
        Mobile: {
          FreeFormNumber: this.mobile_free_form_number,
        },
        Job: this.job,
        BalanceWithJobs: this.balance_with_job,
        PrimaryPhone: {
          FreeFormNumber: this.primary_phone_free_form_number,
        },
        OpenBalanceDate: this.open_balance_date,
        Taxable: this.taxable,
        AlternatePhone: {
          FreeFormNumber: this.alternate_phone_free_form_number,
        },
        ParentRef: {
          value: this.parent_ref_value,
          name: this.parent_ref_name,
        },
        Notes: this.notes,
        WebAddr: this.web_addr,
        Active: this.active,
        Balance: this.balance,
        ShipAddr: {
          Id: this.ship_addr_id,
          PostalCode: this.ship_addr_postal_code,
          City: this.ship_addr_city,
          Country: this.ship_addr_country,
          Line5: this.ship_addr_line5,
          Line4: this.ship_addr_line4,
          Line3: this.ship_addr_line3,
          Line2: this.ship_addr_line2,
          Line1: this.ship_addr_line1,
          Lat: this.ship_addr_late,
          Long: this.ship_addr_long,
          CountrySubDivisionCode: this.ship_addr_country_sub_division_code,
        },
        PaymentMethodRef: {
          value: this.payment_method_ref_value,
          name: this.payment_method_ref_name,
        },
        IsProject: this.is_project,
        CompanyName: this.company_name,
        PrimaryTaxIdentifier: this.primary_tax_identifier,
        GSTRegistrationType: this.gst_registration_type,
        PrintOnCheckName: this.print_on_check_name,
        BillAddr: {
          Id: this.bill_addr_id,
          PostalCode: this.bill_addr_postal_code,
          City: this.bill_addr_city,
          Country: this.bill_addr_country,
          Line5: this.bill_addr_line5,
          Line4: this.bill_addr_line4,
          Line3: this.bill_addr_line3,
          Line2: this.bill_addr_line2,
          Line1: this.bill_addr_line1,
          Lat: this.bill_addr_late,
          Long: this.bill_addr_long,
          CountrySubDivisionCode: this.bill_addr_country_sub_division_code,
        },
        TaxExemptionReasonId: this.tax_exemption_reason_id,
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
