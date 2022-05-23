import constants from "../constants.mjs";

export default {
  AccountNumber: {
    type: "string",
    label: "Account Number",
    description: "Account number assigned to this account (not the unique, system-generated ID assigned during creation). Maximum size is 40 characters.",
  },
  AccountSource: {
    type: "string",
    label: "Account Source",
    description: "The source of the account record. For example, Advertisement, Data.com, or Trade Show. The source is selected from a picklist of available values, which are set by an administrator in Salesforce. Each picklist value can have up to 40 characters.",
  },
  AnnualRevenue: {
    type: "string",
    label: "Annual Revenue",
    description: "Estimated annual revenue of the account.",
  },
  BillingCity: {
    type: "string",
    label: "Billing City",
    description: "Details for the billing address of this account. Maximum size is 40 characters.",
  },
  BillingCountry: {
    type: "string",
    label: "Billing Country",
    description: "Details for the billing address of this account. Maximum size is 80 characters.",
  },
  BillingCountryCode: {
    type: "string",
    label: "BillingCountryCode",
    description: "The ISO country code for the account's billing address.",
  },
  BillingGeocodeAccuracy: {
    type: "string",
    label: "Billing Geocode Accuracy",
    description: "Accuracy level of the geocode for the billing address. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.",
  },
  BillingLatitude: {
    type: "integer",
    label: "Billing Latitude",
    description: "Used with BillingLongitude to specify the precise geolocation of a billing address. Acceptable values are numbers between 90 and 90 with up to 15 decimal places. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.",
  },
  BillingLongitude: {
    type: "integer",
    label: "Billing Longitude",
    description: "Used with BillingLatitude to specify the precise geolocation of a billing address. Acceptable values are numbers between 180 and 180 with up to 15 decimal places. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations)  for details on geolocation compound fields.",
  },
  BillingPostalCode: {
    type: "string",
    label: "Billing Postal Code",
    description: "Details for the billing address of this account. Maximum size is 20 characters.",
  },
  BillingState: {
    type: "string",
    label: "Billing State",
    description: "Details for the billing address of this account. Maximum size is 80 characters.",
  },
  BillingStateCode: {
    type: "string",
    label: "Billing State Code",
    description: "The ISO state code for the account's billing address.",
  },
  BillingStreet: {
    type: "string",
    label: "Billing Street",
    description: "Street address for the billing address of this account.",
  },
  ChannelProgramName: {
    type: "string",
    label: "Channel Program Name",
    description: "Read only. Name of the channel program the account has enrolled.\nIf this account has enrolled more than one channel program, the oldest channel program name will be displayed.",
  },
  ChannelProgramLevelName: {
    type: "string",
    label: "Channel Program Level Name",
    description: "Read only. Name of the channel program level the account has enrolled.\nIf this account has enrolled more than one channel program level, the oldest channel program name will be displayed.",
  },
  CleanStatus: {
    type: "string",
    label: "Clean Status",
    description: "Indicates the record's clean status as compared with Data.com. Values are: Matched, Different, Acknowledged, NotFound, Inactive, Pending, SelectMatch, or Skipped. Several values for CleanStatus display with different labels on the account record detail page.\nMatched displays as In Sync\nAcknowledged displays as Reviewed\nPending displays as Not Compared",
    options: constants.CLEAN_STATUS,
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Text description of the account. Limited to 32,000 KB.",
  },
  DunsNumber: {
    type: "string",
    label: "Duns Number",
    description: "The Data Universal Numbering System (D-U-N-S) number is a unique, nine-digit number assigned to every business location in the Dun & Bradstreet database that has a unique, separate, and distinct operation. D-U-N-S numbers are used by industries and organizations around the world as a global standard for business identification and tracking. Maximum size is 9 characters. This field is available on business accounts, not person accounts.\nThis field is only available to organizations that use Data.com Prospector or Data.com Clean.",
  },
  Fax: {
    type: "string",
    label: "Fax",
    description: "Fax number for the account.",
  },
  HasOptedOutOfEmail: {
    type: "boolean",
    label: "Has Opted Out Of Email",
    description: "Indicates whether the contact doesn't want to receive email from Salesforce (true) or does (false).",
  },
  Industry: {
    type: "string",
    label: "Industry",
    description: "An industry associated with this account. Maximum size is 40 characters.",
  },
  IsCustomerPortal: {
    type: "boolean",
    label: "Is Customer Portal",
    description: "Indicates whether the account has at least one contact enabled to use the organization's Customer Portal (true) or not (false). This field is available if Customer Portal is enabled OR Communities is enabled and you have Customer Portal licenses.\nIf you change this field's value from true to false, you can disable up to 100 Customer Portal users associated with the account and permanently delete all of the account's Customer Portal roles and groups. You can't restore deleted Customer Portal roles and groups. This field can be updated in API version 16.0 and later. We recommend that you update up to 50 contacts simultaneously when changing the accounts on contacts enabled for a Customer Portal or partner portal. We also recommend that you make this update after business hours.",
  },
  Jigsaw: {
    type: "string",
    label: "Jigsaw",
    description: "References the ID of a company in Data.com. If an account has a value in this field, it means that the account was imported from Data.com. If the field value is null, the account was not imported from Data.com. Maximum size is 20 characters. Available in API version 22.0 and later. Label is Data.com Key. This field is available on business accounts, not person accounts. The Jigsaw field is exposed in the API to support troubleshooting for import errors and reimporting of corrected data. Do not modify the value in the Jigsaw field.",
  },
  NaicsCode: {
    type: "string",
    label: "Naics Code",
    description: "The six-digit North American Industry Classification System (NAICS) code is the standard used by business and government to classify business establishments into industries, according to their economic activity for the purpose of collecting, analyzing, and publishing statistical data related to the U.S. business economy. Maximum size is 8 characters. This field is available on business accounts, not person accounts.\nThis field is only available to organizations that use Data.com Prospector or Data.com Clean.",
  },
  NaicsDesc: {
    type: "string",
    label: "Naics Desc",
    description: "A brief description of an organization's line of business, based on its NAICS code. Maximum size is 120 characters. This field is available on business accounts, not person accounts.\nThis field is only available to organizations that use Data.com Prospector or Data.com Clean.",
  },
  NumberOfEmployees: {
    type: "integer",
    label: "Number Of Employees",
    description: "Number of employees working at the company represented by this account. Maximum size is eight digits.",
  },
  OperatingHoursId: {
    type: "string",
    label: "Operating Hours Id",
    description: "The operating hours associated with the account. Available only if Field Service Lightning is enabled.",
  },
  OwnerId: {
    type: "string",
    label: "Owner Id",
    description: "The ID of the user who currently owns this account. Default value is the user logged in to the API to perform the create.\nIf you have set up account teams in your organization, updating this field has different consequences depending on your version of the API:\nFor API version 12.0 and later, sharing records are kept, as they are for all objects.\nFor API version before 12.0, sharing records are deleted.\nFor API version 16.0 and later, users must have the Transfer Record permission in order to update (transfer) account ownership using this field.",
  },
  Ownership: {
    type: "string",
    label: "Ownership",
    description: "Ownership type for the account, for example Private, Public, or Subsidiary.",
  },
  ParentId: {
    type: "string",
    label: "Parent Id",
    description: "ID of the parent object, if any.",
  },
  PersonIndividualId: {
    type: "string",
    label: "Person Individual ID",
    description: "ID of the data privacy record associated with this person's account. This field is available if you enabled Data Protection and Privacy in Setup.\nAvailable in API version 42.0 and later.",
  },
  Phone: {
    type: "string",
    label: "Phone",
    description: "Phone number for this account. Maximum size is 40 characters.",
  },
  PhotoUrl: {
    type: "string",
    label: "Photo Url",
    description: "Path to be combined with the URL of a Salesforce instance (for example, https://yourInstance.salesforce.com/) to generate a URL to request the social network profile image associated with the account. Generated URL returns an HTTP redirect (code 302) to the social network profile image for the account.\nBlank if Social Accounts and Contacts isn't enabled for the organization or if Social Accounts and Contacts is disabled for the requesting user.",
  },
  Rating: {
    type: "string",
    label: "Rating",
    description: "The account's prospect rating, for example Hot, Warm, or Cold.",
  },
  RecordTypeId: {
    type: "string",
    label: "Record Type Id",
    description: "ID of the record type assigned to this object.",
  },
  Salutation: {
    type: "string",
    label: "Salutation",
    description: "Honorific added to the name for use in letters, etc.",
  },
  ShippingCity: {
    type: "string",
    label: "Shipping City",
    description: "Details of the shipping address for this account. City maximum size is 40 characters",
  },
  ShippingCountry: {
    type: "string",
    label: "Shipping Country",
    description: "Details of the shipping address for this account. Country maximum size is 80 characters.",
  },
  ShippingCountryCode: {
    type: "string",
    label: "Shipping Country Code",
    description: "The ISO country code for the account's shipping address.",
  },
  ShippingGeocodeAccuracy: {
    type: "string",
    label: "Shipping Geocode Accuracy",
    description: "Accuracy level of the geocode for the shipping address. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.",
  },
  ShippingLatitude: {
    type: "string",
    label: "Shipping Latitude",
    description: "Used with ShippingLongitude to specify the precise geolocation of a shipping address. Acceptable values are numbers between 90 and 90 with up to 15 decimal places. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields",
  },
  ShippingLongitude: {
    type: "integer",
    label: "Shipping Longitude",
    description: "Used with ShippingLatitude to specify the precise geolocation of an address. Acceptable values are numbers between 180 and 180 with up to 15 decimal places. See [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations) for details on geolocation compound fields.",
  },
  ShippingPostalCode: {
    type: "string",
    label: "Shipping Postal Code",
    description: "Details of the shipping address for this account. Postal code maximum size is 20 characters.",
  },
  ShippingState: {
    type: "string",
    label: "Shipping State",
    description: "Details of the shipping address for this account. State maximum size is 80 characters.",
  },
  ShippingStateCode: {
    type: "string",
    label: "Shipping State Code",
    description: "The ISO state code for the account's shipping address.",
  },
  ShippingStreet: {
    type: "string",
    label: "Shipping Street",
    description: "The street address of the shipping address for this account. Maximum of 255 characters.",
  },
  Sic: {
    type: "string",
    label: "Sic",
    description: "Standard Industrial Classification code of the company's main business categorization, for example, 57340 for Electronics. Maximum of 20 characters. This field is available on business accounts, not person accounts.",
  },
  SicDesc: {
    type: "string",
    label: "Sic Description",
    description: "A brief description of an organization's line of business, based on its SIC code. Maximum length is 80 characters. This field is available on business accounts, not person accounts.",
  },
  Site: {
    type: "string",
    label: "Site",
    description: "Name of the account's location, for example Headquarters or London. Label is Account Site. Maximum of 80 characters.",
  },
  TickerSymbol: {
    type: "string",
    label: "Ticker Symbol",
    description: "The stock market symbol for this account. Maximum of 20 characters. This field is available on business accounts, not person accounts.",
  },
  Tradestyle: {
    type: "string",
    label: "Tradestyle",
    description: "A name, different from its legal name, that an organization may use for conducting business. Similar to Doing business as or DBA. Maximum length is 255 characters. This field is available on business accounts, not person accounts. This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
  },
  Type: {
    type: "string",
    label: "Type",
    description: "Type of account, for example, Customer, Competitor, or Partner.",
  },
  Website: {
    type: "string",
    label: "Website",
    description: "The website of this account. Maximum of 255 characters.",
  },
  YearStarted: {
    type: "string",
    label: "Year Started",
    description: "The date when an organization was legally established. Maximum length is 4 characters. This field is available on business accounts, not person accounts.\nThis field is only available to organizations that use Data.com Prospector or Data.com Clean.",
  },
};
