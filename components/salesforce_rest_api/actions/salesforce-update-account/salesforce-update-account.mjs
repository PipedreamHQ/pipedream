// legacy_hash_id: a_zNiORn
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-update-account",
  name: "Update Account",
  description: "Updates a Salesforce account, representing an individual account, which is an organization or person involved with your business (such as customers, competitors, and partners).",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    AccountId: {
      type: "string",
      description: "ID of the Account to modify.",
    },
    AccountNumber: {
      type: "string",
      description: "Account number assigned to this account (not the unique, system-generated ID assigned during creation). Maximum size is 40 characters.",
      optional: true,
    },
    AccountSource: {
      type: "string",
      description: "The source of the account record. For example, Advertisement, Data.com, or Trade Show. The source is selected from a picklist of available values, which are set by an administrator. Each picklist value can have up to 40 characters.",
      optional: true,
    },
    AnnualRevenue: {
      type: "string",
      description: "Estimated annual revenue of the account.",
      optional: true,
    },
    BillingCity: {
      type: "string",
      description: "Details for the billing address of this account. Maximum size is 40 characters.",
      optional: true,
    },
    BillingCountry: {
      type: "string",
      description: "Details for the billing address of this account. Maximum size is 80 characters.",
      optional: true,
    },
    BillingCountryCode: {
      type: "string",
      description: "The ISO country code for the account's billing address.",
      optional: true,
    },
    BillingGeocodeAccuracy: {
      type: "string",
      description: "Accuracy level of the geocode for the billing address. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.",
      optional: true,
    },
    BillingLatitude: {
      type: "integer",
      description: "Used with BillingLongitude to specify the precise geolocation of a billing address. Acceptable values are numbers between 90 and 90 with up to 15 decimal places. See [Compound Field Considerations and Limitations](Accuracy level of the geocode for the billing address. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.) for details on geolocation compound fields.",
      optional: true,
    },
    BillingLongitude: {
      type: "integer",
      description: "Used with BillingLatitude to specify the precise geolocation of a billing address. Acceptable values are numbers between 180 and 180 with up to 15 decimal places. See [Compound Field Considerations and Limitations](atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.",
      optional: true,
    },
    BillingPostalCode: {
      type: "string",
      description: "Details for the billing address of this account. Maximum size is 20 characters.",
      optional: true,
    },
    BillingState: {
      type: "string",
      description: "Details for the billing address of this account. Maximum size is 80 characters.",
      optional: true,
    },
    BillingStateCode: {
      type: "string",
      description: "The ISO state code for the account's billing address.",
      optional: true,
    },
    BillingStreet: {
      type: "string",
      description: "Street address for the billing address of this account.",
      optional: true,
    },
    CleanStatus: {
      type: "string",
      description: "Indicates the record's clean status as compared with Data.com. Values are: Matched, Different, Acknowledged, NotFound, Inactive, Pending, SelectMatch, or Skipped.Several values for CleanStatus display with different labels on the account record detail page. Matched displays as In Sync Acknowledged displays as Reviewed Pending displays as Not Compared",
      optional: true,
    },
    Description: {
      type: "string",
      description: "Text description of the account. Limited to 32,000 KB.",
      optional: true,
    },
    DunsNumber: {
      type: "string",
      description: "The Data Universal Numbering System (D-U-N-S) number is a unique, nine-digit number assigned to every business location in the Dun &amp; Bradstreet database that has a unique, separate, and distinct operation. D-U-N-S numbers are used by industries and organizations around the world as a global standard for business identification and tracking. Maximum size is 9 characters. This field is available on business accounts, not person accounts. Note This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
      optional: true,
    },
    Fax: {
      type: "string",
      description: "Fax number for the account.",
      optional: true,
    },
    HasOptedOutOfEmail: {
      type: "boolean",
      description: "Indicates whether the contact doesn't want to receive email from Salesforce (true) or does (false). Label is Email Opt Out.",
      optional: true,
    },
    Industry: {
      type: "string",
      description: "An industry associated with this account. Maximum size is 40 characters.",
      optional: true,
    },
    IsCustomerPortal: {
      type: "boolean",
      description: "Indicates whether the account has at least one contact enabled to use the organization's Customer Portal (true) or not (false). This field is available if Customer Portal is enabled OR Communities is enabled and you have Customer Portal licenses.If you change this field's value from true to false, you can disable up to 100 Customer Portal users associated with the account and permanently delete all of the account's Customer Portal roles and groups. You can't restore deleted Customer Portal roles and groups. This field can be updated in API version 16.0 and later. Tip We recommend that you update up to 50 contacts simultaneously when changing the accounts on contacts enabled for a Customer Portal or partner portal. We also recommend that you make this update after business hours.",
      optional: true,
    },
    IsPartner: {
      type: "boolean",
      description: "Indicates whether the account has at least one contact enabled to use the organization's partner portal (true) or not (false). This field is available if partner relationship management (partner portal) is enabled OR Communities is enabled and you have partner portal licenses.If you change this field's value from true to false, you can disable up to 15 partner portal users associated with the account and permanently delete all of the account's partner portal roles and groups. You can't restore deleted partner portal roles and groups. Disabling a partner portal user in the Salesforce user interface or the API does not change this field's value from true to false. Even if this field's value is false, you can enable a contact on an account as a partner portal user via the API. This field can be updated in API version 16.0 and later. Tip We recommend that you update up to 50 contacts simultaneously when changing the accounts on contacts enabled for a Customer Portal or partner portal. We also recommend that you make this update after business hours.",
      optional: true,
    },
    Jigsaw: {
      type: "string",
      description: "References the ID of a company in Data.com. If an account has a value in this field, it means that the account was imported from Data.com. If the field value is null, the account was not imported from Data.com. Maximum size is 20 characters. Available in API version 22.0 and later. Label is Data.com Key. This field is available on business accounts, not person accounts. Important The Jigsaw field is exposed in the API to support troubleshooting for import errors and reimporting of corrected data. Do not modify the value in the Jigsaw field.",
      optional: true,
    },
    NaicsCode: {
      type: "string",
      description: "The six-digit North American Industry Classification System (NAICS) code is the standard used by business and government to classify business establishments into industries, according to their economic activity for the purpose of collecting, analyzing, and publishing statistical data related to the U.S. business economy. Maximum size is 8 characters. This field is available on business accounts, not person accounts. Note This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
      optional: true,
    },
    NaicsDesc: {
      type: "string",
      description: "A brief description of an organization's line of business, based on its NAICS code. Maximum size is 120 characters. This field is available on business accounts, not person accounts. Note This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
      optional: true,
    },
    Name: {
      type: "string",
      description: "Required. Label is Account Name. Name of the account. Maximum size is 255 characters. If the account has a record type of Person Account: This value is the concatenation of the FirstName, MiddleName, LastName, and Suffix of the associated person contact. You can't modify this value.",
      optional: true,
    },
    NumberOfEmployees: {
      type: "integer",
      description: "Label is Employees. Number of employees working at the company represented by this account. Maximum size is eight digits.",
      optional: true,
    },
    OperatingHoursId: {
      type: "string",
      description: "The operating hours associated with the account. Available only if Field Service Lightning is enabled.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      description: "The ID of the user who currently owns this account. Default value is the user logged in to the API to perform the create.If you have set up account teams in your organization, updating this field has different consequences depending on your version of the API: For API version 12.0 and later, sharing records are kept, as they are for all objects. For API version before 12.0, sharing records are deleted. For API version 16.0 and later, users must have the Transfer Record permission in order to update (transfer) account ownership using this field.",
      optional: true,
    },
    Ownership: {
      type: "string",
      description: "Ownership type for the account, for example Private, Public, or Subsidiary.",
      optional: true,
    },
    ParentId: {
      type: "string",
      description: "ID of the parent object, if any.",
      optional: true,
    },
    PersonIndividualId: {
      type: "string",
      description: "ID of the data privacy record associated with this person's account. This field is available if you enabled Data Protection and Privacy in Setup.",
      optional: true,
    },
    Phone: {
      type: "string",
      description: "Phone number for this account. Maximum size is 40 characters.",
      optional: true,
    },
    Rating: {
      type: "string",
      description: "The account's prospect rating, for example Hot, Warm, or Cold.",
      optional: true,
    },
    RecordTypeId: {
      type: "string",
      description: "ID of the record type assigned to this object.",
      optional: true,
    },
    Salutation: {
      type: "string",
      description: "Honorific added to the name for use in letters, etc.",
      optional: true,
    },
    ShippingCity: {
      type: "string",
      description: "Details of the shipping address for this account. City maximum size is 40 characters",
      optional: true,
    },
    ShippingCountry: {
      type: "string",
      description: "Details of the shipping address for this account. Country maximum size is 80 characters.",
      optional: true,
    },
    ShippingCountryCode: {
      type: "string",
      description: "The ISO country code for the account's shipping address.",
      optional: true,
    },
    ShippingGeocodeAccuracy: {
      type: "string",
      description: "Accuracy level of the geocode for the shipping address. See [Compound Field Considerations and Limitations](Accuracy level of the geocode for the billing address. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.) for details on geolocation compound fields.",
      optional: true,
    },
    ShippingLatitude: {
      type: "integer",
      description: "Used with ShippingLongitude to specify the precise geolocation of a shipping address. Acceptable values are numbers between 90 and 90 with up to 15 decimal places. See [Compound Field Considerations and Limitations](Accuracy level of the geocode for the billing address. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.) for details on geolocation compound fields.",
      optional: true,
    },
    ShippingLongitude: {
      type: "integer",
      description: "Used with ShippingLatitude to specify the precise geolocation of an address. Acceptable values are numbers between 180 and 180 with up to 15 decimal places. See [Compound Field Considerations and Limitations](Accuracy level of the geocode for the billing address. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.) for details on geolocation compound fields.",
      optional: true,
    },
    ShippingPostalCode: {
      type: "string",
      description: "Details of the shipping address for this account. Postal code maximum size is 20 characters.",
      optional: true,
    },
    ShippingState: {
      type: "string",
      description: "Details of the shipping address for this account. State maximum size is 80 characters.",
      optional: true,
    },
    ShippingStateCode: {
      type: "string",
      description: "The ISO state code for the account's shipping address.",
      optional: true,
    },
    ShippingStreet: {
      type: "string",
      description: "The street address of the shipping address for this account. Maximum of 255 characters.",
      optional: true,
    },
    Sic: {
      type: "string",
      description: "Standard Industrial Classification code of the company's main business categorization, for example, 57340 for Electronics. Maximum of 20 characters. This field is available on business accounts, not person accounts.",
      optional: true,
    },
    SicDesc: {
      type: "string",
      description: "A brief description of an organization's line of business, based on its SIC code. Maximum length is 80 characters. This field is available on business accounts, not person accounts.",
      optional: true,
    },
    Site: {
      type: "string",
      description: "Name of the account's location, for example Headquarters or London. Label is Account Site. Maximum of 80 characters.",
      optional: true,
    },
    TickerSymbol: {
      type: "string",
      description: "The stock market symbol for this account. Maximum of 20 characters. This field is available on business accounts, not person accounts.",
      optional: true,
    },
    Tradestyle: {
      type: "string",
      description: "A name, different from its legal name, that an organization may use for conducting business. Similar to Doing business as or DBA. Maximum length is 255 characters. This field is available on business accounts, not person accounts. Note This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
      optional: true,
    },
    Type: {
      type: "string",
      description: "Type of account, for example, Customer, Competitor, or Partner.",
      optional: true,
    },
    Website: {
      type: "string",
      description: "The website of this account. Maximum of 255 characters.",
      optional: true,
    },
    YearStarted: {
      type: "string",
      description: "The date when an organization was legally established. Maximum length is 4 characters. This field is available on business accounts, not person accounts. Note This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_update_fields.htm
  // Account object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_account.htm

    if (!this.AccountId) {
      throw new Error("Must provide AccountId parameter.");
    }

    return await axios($, {
      "method": "patch",
      "url": `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/Account/${this.AccountId}`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
      "data": {
        AccountNumber: this.AccountNumber,
        AccountSource: this.AccountSource,
        AnnualRevenue: this.AnnualRevenue,
        BillingCity: this.BillingCity,
        BillingCountry: this.BillingCountry,
        BillingCountryCode: this.BillingCountryCode,
        BillingGeocodeAccuracy: this.BillingGeocodeAccuracy,
        BillingLatitude: this.BillingLatitude,
        BillingLongitude: this.BillingLongitude,
        BillingPostalCode: this.BillingPostalCode,
        BillingState: this.BillingState,
        BillingStateCode: this.BillingStateCode,
        BillingStreet: this.BillingStreet,
        CleanStatus: this.CleanStatus,
        Description: this.Description,
        DunsNumber: this.DunsNumber,
        Fax: this.Fax,
        HasOptedOutOfEmail: this.HasOptedOutOfEmail,
        Industry: this.Industry,
        IsCustomerPortal: this.IsCustomerPortal,
        IsPartner: this.IsPartner,
        Jigsaw: this.Jigsaw,
        NaicsCode: this.NaicsCode,
        NaicsDesc: this.NaicsDesc,
        Name: this.Name,
        NumberOfEmployees: this.NumberOfEmployees,
        OperatingHoursId: this.OperatingHoursId,
        OwnerId: this.OwnerId,
        Ownership: this.Ownership,
        ParentId: this.ParentId,
        PersonIndividualId: this.PersonIndividualId,
        Phone: this.Phone,
        Rating: this.Rating,
        RecordTypeId: this.RecordTypeId,
        Salutation: this.Salutation,
        ShippingCity: this.ShippingCity,
        ShippingCountry: this.ShippingCountry,
        ShippingCountryCode: this.ShippingCountryCode,
        ShippingGeocodeAccuracy: this.ShippingGeocodeAccuracy,
        ShippingLatitude: this.ShippingLatitude,
        ShippingLongitude: this.ShippingLongitude,
        ShippingPostalCode: this.ShippingPostalCode,
        ShippingState: this.ShippingState,
        ShippingStateCode: this.ShippingStateCode,
        ShippingStreet: this.ShippingStreet,
        Sic: this.Sic,
        SicDesc: this.SicDesc,
        Site: this.Site,
        TickerSymbol: this.TickerSymbol,
        Tradestyle: this.Tradestyle,
        Type: this.Type,
        Website: this.Website,
        YearStarted: this.YearStarted,
      },
    });
  },
};
