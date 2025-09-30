import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-update-customer",
  name: "Update Customer",
  description: "Updates a customer. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer#full-update-a-customer)",
  version: "0.1.12",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    customerId: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
    displayName: {
      propDefinition: [
        quickbooks,
        "displayName",
      ],
    },
    title: {
      propDefinition: [
        quickbooks,
        "title",
      ],
    },
    givenName: {
      propDefinition: [
        quickbooks,
        "givenName",
      ],
    },
    middleName: {
      propDefinition: [
        quickbooks,
        "middleName",
      ],
    },
    familyName: {
      propDefinition: [
        quickbooks,
        "familyName",
      ],
    },
    suffix: {
      propDefinition: [
        quickbooks,
        "suffix",
      ],
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
    },
    active: {
      description: "If true, this entity is currently enabled for use by QuickBooks. If there is an amount in `Customer.Balance` when setting this Customer object to inactive through the QuickBooks UI, a CreditMemo balancing transaction is created for the amount.",
      label: "Active",
      optional: true,
      type: "boolean",
    },
    alternatePhoneFreeFormNumber: {
      description: "Specifies the alternate phone number in free form.",
      label: "Alternate Phone Free Form Number",
      optional: true,
      type: "string",
    },
    arAccountRefValue: {
      description: "ID of the accounts receivable account to be used for this customer. Each customer must have his own AR account. Applicable for France companies, only. Available when endpoint is evoked with the minorversion=3 query parameter. Query the Account name list resource to determine the appropriate Account object for this reference, where Account.AccountType=Accounts Receivable. Use `Account.Id` from that object for `ARAccountRef.value`.",
      label: "AR Account Ref Value",
      type: "string",
      propDefinition: [
        quickbooks,
        "accountIds",
      ],
    },
    billAddrCity: {
      description: "City name for the billing address.",
      label: "Bill Addr City",
      optional: true,
      type: "string",
    },
    billAddrCountry: {
      description: "Country name. For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.",
      label: "Bill Addr Country",
      optional: true,
      type: "string",
    },
    billAddrCountrySubDivisionCode: {
      description: "Region within a country for the billing address. For example, state name for USA, province name for Canada.",
      label: "Bill Addr Country Sub Division Code",
      optional: true,
      type: "string",
    },
    billAddrLate: {
      description: "Latitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      label: "Bill Addr Late",
      optional: true,
      type: "string",
    },
    billAddrLine1: {
      description: "First line of the billing address.",
      label: "Bill Addr Line 1",
      optional: true,
      type: "string",
    },
    billAddrLine2: {
      description: "Second line of the billing address.",
      label: "Bill Addr Line 2",
      optional: true,
      type: "string",
    },
    billAddrLine3: {
      description: "Third line of the billing address.",
      label: "Bill Addr Line 3",
      optional: true,
      type: "string",
    },
    billAddrLine4: {
      description: "Fourth line of the billing address.",
      label: "Bill Addr Line 4",
      optional: true,
      type: "string",
    },
    billAddrLine5: {
      description: "Fifth line of the billing address.",
      label: "Bill Addr Line 5",
      optional: true,
      type: "string",
    },
    billAddrLong: {
      description: "Longitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      label: "Bill Addr Long",
      optional: true,
      type: "string",
    },
    billAddrPostalCode: {
      description: "Postal code for the billing address. For example, zip code for USA and Canada.",
      label: "Bill Addr Postal Code",
      optional: true,
      type: "string",
    },
    billWithParent: {
      description: "If true, this Customer object is billed with its parent. If false, or null the customer is not to be billed with its parent. This attribute is valid only if this entity is a Job or sub Customer.",
      label: "Bill With Parent",
      optional: true,
      type: "boolean",
    },
    businessNumber: {
      description: "Also called, PAN (in India) is a code that acts as an identification for individuals, families and corporates, especially for those who pay taxes on their income.",
      label: "Business Number",
      optional: true,
      type: "string",
    },
    companyName: {
      description: "The name of the company associated with the person or organization.",
      label: "Company Name",
      optional: true,
      type: "string",
    },
    customerTypeRefValue: {
      propDefinition: [
        quickbooks,
        "customerType",
      ],
    },
    defaultTaxCodeValue: {
      description: "ID of the default tax code associated with this Customer object. Reference is valid if `Customer.Taxable` is set to true; otherwise, it is ignored. If automated sales tax is enabled (`Preferences.TaxPrefs.PartnerTaxEnabled` is set to true) the default tax code is set by the system and can not be overridden. Query the `TaxCode` name list resource to determine the appropriate `TaxCode` object for this reference. Use `TaxCode.Id` from that object for `DefaultTaxCodeRef.value`.",
      label: "Default Tax Code Value",
      optional: true,
      type: "string",
    },
    faxFreeFormNumber: {
      description: "Specifies the fax number in free form.",
      label: "Fax Free Form Number",
      optional: true,
      type: "string",
    },
    GSTIN: {
      description: "GSTIN is an identification number assigned to every GST registered business.",
      label: " G S T I N",
      optional: true,
      type: "string",
    },
    gstRegistrationType: {
      description: "For the filing of GSTR, transactions need to be classified depending on the type of customer to whom the sale is done. To facilitate this, we have introduced a new field as 'GST registration type'.\nPossible values are listed below, for their description [See the API Docs](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer#full-update-a-customer).\n* `GST_REG_REG`\n* `GST_REG_COMP`\n* `GST_UNREG`\n* `CONSUMER`\n* `OVERSEAS`\n* `SEZ`\n* `DEEMED`",
      label: "Gst Registration Type",
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
      type: "string",
    },
    job: {
      description: "If true, this is a Job or sub-customer. If false or null, this is a top level customer, not a Job or sub-customer.",
      label: "Job",
      optional: true,
      type: "boolean",
    },
    mobileFreeFormNumber: {
      description: "Specifies the mobile phone number in free form.",
      label: "Mobile Free Form Number",
      optional: true,
      type: "string",
    },
    notes: {
      description: "Free form text describing the Customer.",
      label: "Notes",
      optional: true,
      type: "string",
    },
    paymentMethodRefValue: {
      propDefinition: [
        quickbooks,
        "paymentMethod",
      ],
    },
    preferredDeliveryMethod: {
      description: "Preferred delivery method. Values are `Print`, `Email`, or `None`.",
      label: "Preferred Delivery Method",
      optional: true,
      options: [
        "Print",
        "Email",
        "None",
      ],
      type: "string",
    },
    primaryEmailAddr: {
      description: "Primary email address.",
      label: "Primary Email Addr",
      optional: true,
      type: "string",
    },
    primaryPhoneFreeFormNumber: {
      description: "Specifies the primary phone number in free form.",
      label: "Primary Phone Free Form Number",
      optional: true,
      type: "string",
    },
    primaryTaxIdentifier: {
      description: "Also called Tax Reg. No in ( UK ) , ( CA ) , ( IN ) , ( AU ) represents the tax ID of the Person or Organization. This value is masked in responses, exposing only last five characters. For example, the ID of `123-45-6789` is returned as `XXXXXX56789`.",
      label: "Primary Tax Identifier",
      optional: true,
      type: "string",
    },
    printOnCheckName: {
      description: "Name of the person or organization as printed on a check. If not provided, this is populated from DisplayName. Constraints: Cannot be removed with sparse update.",
      label: "Print On Check Name",
      optional: true,
      type: "string",
    },
    resaleNum: {
      description: "Resale number or some additional info about the customer.",
      label: "Resale Num",
      optional: true,
      type: "string",
    },
    saleTermRefValue: {
      description: "ID of a SalesTerm object associated with this Customer object. Query the Term name list resource to determine the appropriate Term object for this reference. Use `Term.Id` from that object for `SalesTermRef.value`.",
      type: "string",
      propDefinition: [
        quickbooks,
        "termIds",
      ],
    },
    secondaryTaxIdentifier: {
      description: "Also called UTR No. in ( UK ) , CST Reg No. ( IN ) also represents the tax registration number of the Person or Organization. This value is masked in responses, exposing only last five characters. For example, the ID of `123-45-6789` is returned as `XXXXXX56789`",
      label: "Secondary Tax Identifier",
      optional: true,
      type: "string",
    },
    shipAddrCity: {
      description: "City name for the shipping address.",
      label: "Ship Addr City",
      optional: true,
      type: "string",
    },
    shipAddrCountry: {
      description: "Country name. For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.",
      label: "Ship Addr Country",
      optional: true,
      type: "string",
    },
    shipAddrCountrySubDivisionCode: {
      description: "Region within a country for the shipping address. For example, state name for USA, province name for Canada.",
      label: "Ship Addr Country Sub Division Code",
      optional: true,
      type: "string",
    },
    shipAddrId: {
      description: "Unique identifier of the QuickBooks object for the shipping address, used for modifying the address. \nThe ShippingAddr object represents the default shipping address. If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:\n* `Line1` and `Line2` elements are populated with the customer name and company name.\n* Original `Line1` through `Line5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.",
      label: "Ship Addr Id",
      optional: true,
      type: "string",
    },
    shipAddrLate: {
      description: "Latitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      label: "Ship Addr Late",
      optional: true,
      type: "string",
    },
    shipAddrLine1: {
      description: "First line of the shipping address.",
      label: "Ship Addr Line 1",
      optional: true,
      type: "string",
    },
    shipAddrLine2: {
      description: "Second line of the shipping address.",
      label: "Ship Addr Line 2",
      optional: true,
      type: "string",
    },
    shipAddrLine3: {
      description: "Third line of the shipping address.",
      label: "Ship Addr Line 3",
      optional: true,
      type: "string",
    },
    shipAddrLine4: {
      description: "Fourth line of the shipping address.",
      label: "Ship Addr Line 4",
      optional: true,
      type: "string",
    },
    shipAddrLine5: {
      description: "Fifth line of the shipping address.",
      label: "Ship Addr Line 5",
      optional: true,
      type: "string",
    },
    shipAddrLong: {
      description: "Longitude coordinate of Geocode (Geospacial Entity Object Code). `INVALID` is returned for invalid addresses.",
      label: "Ship Addr Long",
      optional: true,
      type: "string",
    },
    shipAddrPostalCode: {
      description: "Postal code for the shipping address. For example, zip code for USA and Canada.",
      label: "Ship Addr Postal Code",
      optional: true,
      type: "string",
    },
    taxable: {
      description: "If true, transactions for this customer are taxable. Default behavior with minor version 10 and above: true, if `DefaultTaxCodeRef` is defined or false if `TaxExemptionReasonId` is set.",
      label: "Taxable",
      optional: true,
      type: "boolean",
    },
    taxExemptionReasonId: {
      label: "Tax Exemption Reason Id",
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
      type: "string",
    },
    webAddr: {
      description: "Website address.",
      label: "Web Addr",
      optional: true,
      type: "string",
    },
  },
  methods: {
    async getSyncToken($) {
      const { Customer: customer } = await this.quickbooks.getCustomer({
        $,
        customerId: this.customerId,
      });
      return customer.SyncToken;
    },
  },
  async run({ $ }) {
    if (
      !this.displayName &&
      (!this.title && !this.givenName && !this.middleName && !this.familyName && !this.suffix) ||
      !this.customerId
    ) {
      throw new ConfigurationError("Must provide displayName or at least one of title, givenName, middleName, familyName, or suffix, and customerId parameters.");
    }

    const hasBillingAddress = this.billAddrPostalCode
      || this.billAddrCity
      || this.billAddrCountry
      || this.billAddrLine5
      || this.billAddrLine4
      || this.billAddrLine3
      || this.billAddrLine2
      || this.billAddrLine1
      || this.billAddrLate
      || this.billAddrLong
      || this.billAddrCountrySubDivisionCode;

    const hasShippingAddress = this.shipAddrId
      || this.shipAddrPostalCode
      || this.shipAddrCity
      || this.shipAddrCountry
      || this.shipAddrLine5
      || this.shipAddrLine4
      || this.shipAddrLine3
      || this.shipAddrLine2
      || this.shipAddrLine1
      || this.shipAddrLate
      || this.shipAddrLong
      || this.shipAddrCountrySubDivisionCode;

    const response = await this.quickbooks.updateCustomer({
      $,
      data: {
        sparse: true,
        Id: this.customerId,
        DisplayName: this.displayName,
        Suffix: this.suffix,
        Title: this.title,
        MiddleName: this.middleName,
        FamilyName: this.familyName,
        GivenName: this.givenName,
        SyncToken: await this.getSyncToken($),
        PrimaryEmailAddr: this.primaryEmailAddr && {
          Address: this.primaryEmailAddr,
        },
        ResaleNum: this.resaleNum,
        SecondaryTaxIdentifier: this.secondaryTaxIdentifier,
        ARAccountRef: this.arAccountRefValue && {
          value: this.arAccountRefValue,
        },
        DefaultTaxCodeRef: this.defaultTaxCodeValue && {
          value: this.defaultTaxCodeValue,
        },
        PreferredDeliveryMethod: this.preferredDeliveryMethod,
        GSTIN: this.GSTIN,
        SalesTermRef: this.saleTermRefValue && {
          value: this.saleTermRefValue,
        },
        CustomerTypeRef: this.customerTypeRefValue && {
          value: this.customerTypeRefValue,
        },
        Fax: this.faxFreeFormNumber && {
          FreeFormNumber: this.faxFreeFormNumber,
        },
        BusinessNumber: this.businessNumber,
        BillWithParent: this.billWithParent,
        CurrencyRef: this.currencyRefValue && {
          value: this.currencyRefValue,
        },
        Mobile: this.mobileFreeFormNumber && {
          FreeFormNumber: this.mobileFreeFormNumber,
        },
        Job: this.job,
        PrimaryPhone: this.primaryPhoneFreeFormNumber && {
          FreeFormNumber: this.primaryPhoneFreeFormNumber,
        },
        Taxable: this.taxable,
        AlternatePhone: this.alternatePhoneFreeFormNumber && {
          FreeFormNumber: this.alternatePhoneFreeFormNumber,
        },
        Notes: this.notes,
        WebAddr: this.webAddr,
        Active: this.active,
        ShipAddr: hasShippingAddress && {
          Id: this.shipAddrId,
          PostalCode: this.shipAddrPostalCode,
          City: this.shipAddrCity,
          Country: this.shipAddrCountry,
          Line5: this.shipAddrLine5,
          Line4: this.shipAddrLine4,
          Line3: this.shipAddrLine3,
          Line2: this.shipAddrLine2,
          Line1: this.shipAddrLine1,
          Lat: this.shipAddrLate,
          Long: this.shipAddrLong,
          CountrySubDivisionCode: this.shipAddrCountrySubDivisionCode,
        },
        PaymentMethodRef: this.paymentMethodRefValue && {
          value: this.paymentMethodRefValue,
        },
        CompanyName: this.companyName,
        PrimaryTaxIdentifier: this.primaryTaxIdentifier,
        GSTRegistrationType: this.gstRegistrationType,
        PrintOnCheckName: this.printOnCheckName,
        BillAddr: hasBillingAddress && {
          PostalCode: this.billAddrPostalCode,
          City: this.billAddrCity,
          Country: this.billAddrCountry,
          Line5: this.billAddrLine5,
          Line4: this.billAddrLine4,
          Line3: this.billAddrLine3,
          Line2: this.billAddrLine2,
          Line1: this.billAddrLine1,
          Lat: this.billAddrLate,
          Long: this.billAddrLong,
          CountrySubDivisionCode: this.billAddrCountrySubDivisionCode,
        },
        TaxExemptionReasonId: this.taxExemptionReasonId,
      },
    });

    if (response) {
      $.export("summary", `Successfully updated customer with ID ${this.customerId}`);
    }

    return response;
  },
};
