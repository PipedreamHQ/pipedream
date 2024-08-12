import {
  CLEAN_STATUS_OPTIONS, GEOCODE_ACCURACY_OPTIONS, RECORD_SOURCE_OPTIONS,
} from "../constants-props.mjs";
import commonProps from "../props-async-options.mjs";

export default {
  createProps: {
    Name: {
      type: "string",
      label: "Account Name",
      description: "Name of the account. Max 255 characters.",
    },
  },
  initialProps: {
    AccountNumber: {
      type: "string",
      label: "Account Number",
      description:
        "Account number assigned to this account (not the unique, system-generated ID assigned during creation). Max 40 characters.",
      optional: true,
    },
    Description: {
      type: "string",
      label: "Description",
      description: "Text description of the account. Limited to 32,000 KB.",
      optional: true,
    },
    Phone: {
      type: "string",
      label: "Phone",
      description: "Phone number for this account. Max 40 characters.",
      optional: true,
    },
    Website: {
      type: "string",
      label: "Website",
      description: "The website of this account. Max 255 characters.",
      optional: true,
    },
  },
  extraProps: {
    OperatingHoursId: {
      ...commonProps.OperatingHoursId,
      description: "The operating hours associated with the account.",
      optional: true,
    },
    OwnerId: {
      ...commonProps.UserId,
      label: "Owner ID",
      description: "The ID of the user who currently owns this account (defaults to the user logged in).",
      optional: true,
    },
    ParentId: {
      ...commonProps.AccountId,
      label: "Parent Account ID",
      description: "ID of the parent account, if any.",
      optional: true,
    },
    RecordTypeId: {
      ...commonProps.RecordTypeId,
      optional: true,
    },
    AccountSource: {
      type: "string",
      label: "Account Source",
      description:
        "The source of the account record. Available values are set by an administrator.",
      optional: true,
      options: RECORD_SOURCE_OPTIONS,
    },
    AnnualRevenue: {
      type: "string",
      label: "Annual Revenue",
      description: "Estimated annual revenue of the account.",
      optional: true,
    },
    BillingCity: {
      type: "string",
      label: "Billing City",
      description: "Max 40 characters.",
      optional: true,
    },
    BillingCountry: {
      type: "string",
      label: "Billing Country",
      description: "Max 80 characters.",
      optional: true,
    },
    BillingGeocodeAccuracy: {
      type: "string",
      label: "Billing Geocode Accuracy",
      description: "Accuracy level of the geocode for the billing address.",
      optional: true,
      options: GEOCODE_ACCURACY_OPTIONS,
    },
    BillingLatitude: {
      type: "string",
      label: "Billing Latitude",
      description:
        "A number between -90 and 90 with up to 15 decimal places. Use with `Billing Longitude` to specify the precise geolocation of a billing address.",
      optional: true,
    },
    BillingLongitude: {
      type: "string",
      label: "Billing Longitude",
      description:
        "A number between -180 and 180 with up to 15 decimal places. Use with `Billing Latitude` to specify the precise geolocation of a billing address.",
      optional: true,
    },
    BillingPostalCode: {
      type: "string",
      label: "Billing Zip/Postal Code",
      description: "Max 20 characters.",
      optional: true,
    },
    BillingState: {
      type: "string",
      label: "Billing State/Province",
      description: "Max 80 characters.",
      optional: true,
    },
    BillingStreet: {
      type: "string",
      label: "Billing Street",
      description: "Street address for the billing address of this account.",
      optional: true,
    },
    CleanStatus: {
      type: "string",
      label: "Clean Status",
      description:
        "Indicates the record's clean status as compared with Data.com.",
      optional: true,
      options: CLEAN_STATUS_OPTIONS,
    },
    DunsNumber: {
      type: "string",
      label: "D-U-N-S Number",
      description: "Unique 9-digit number (Data Universal Numbering System).",
      optional: true,
    },
    Fax: {
      type: "string",
      label: "Account Fax",
      description: "Fax number for the account.",
      optional: true,
    },
    HasOptedOutOfEmail: {
      type: "boolean",
      label: "Email Opt Out",
      description: "Indicates whether the contact doesn't want to receive email from Salesforce (true) or does (false)",
      optional: true,
    },
    Industry: {
      type: "string",
      label: "Industry",
      description:
        "An industry associated with this account. Max 40 characters.",
      optional: true,
    },
    IsPriorityRecord: {
      type: "boolean",
      label: "Is Priority Record",
      description:
        "Shows whether the user has marked the account as important.",
      optional: true,
    },
    NaicsCode: {
      type: "string",
      label: "NAICS Code",
      description:
        "6-digit code (North American Industry Classification System)",
      optional: true,
    },
    NaicsDesc: {
      type: "string",
      label: "NAICS Description",
      description:
        "A brief description of an org's line of business, based on its NAICS code. Max 120 characters.",
      optional: true,
    },
    NumberOfEmployees: {
      type: "integer",
      label: "Employees",
      description:
        "Number of employees working at the company represented by this account.",
      max: 99999999,
      optional: true,
    },
    Ownership: {
      type: "string",
      label: "Ownership",
      description: "Ownership type for the account.",
      optional: true,
      options: [
        "Public",
        "Private",
        "Subsidiary",
        "Other",
      ],
    },
    PersonIndividualId: {
      type: "string",
      label: "Person Individual ID",
      description: "ID of the data privacy record associated with this person's account.",
      optional: true,
    },
    Rating: {
      type: "string",
      label: "Account Rating",
      description: "The account's prospect rating.",
      optional: true,
      options: [
        "Hot",
        "Warm",
        "Cold",
      ],
    },
    ShippingCity: {
      type: "string",
      label: "Shipping City",
      description: "Max 40 characters.",
      optional: true,
    },
    ShippingCountry: {
      type: "string",
      label: "Shipping Country",
      description: "Max 80 characters.",
      optional: true,
    },
    ShippingGeocodeAccuracy: {
      type: "string",
      label: "Shipping Geocode Accuracy",
      description: "Accuracy level of the geocode for the shipping address.",
      optional: true,
      options: [
        {
          label: "Address",
          value: "Address",
        },
        {
          label: "Near Address",
          value: "NearAddress",
        },
        {
          label: "Block",
          value: "Block",
        },
        {
          label: "Street",
          value: "Street",
        },
        {
          label: "Extended Zip",
          value: "ExtendedZip",
        },
        {
          label: "Zip",
          value: "Zip",
        },
      ],
    },
    ShippingLatitude: {
      type: "string",
      label: "Shipping Latitude",
      description:
        "A number between -90 and 90 with up to 15 decimal places. Use with `Shipping Longitude` to specify the precise geolocation of a shipping address.",
      optional: true,
    },
    ShippingLongitude: {
      type: "string",
      label: "Shipping Longitude",
      description:
        "A number between -180 and 180 with up to 15 decimal places. Use with `Shipping Latitude` to specify the precise geolocation of a shipping address.",
      optional: true,
    },
    ShippingPostalCode: {
      type: "string",
      label: "Shipping Zip/Postal Code",
      description: "Max 20 characters.",
      optional: true,
    },
    ShippingState: {
      type: "string",
      label: "Shipping State/Province",
      description: "Max 80 characters.",
      optional: true,
    },
    ShippingStreet: {
      type: "string",
      label: "Shipping Street",
      description:
        "The street address of the shipping address for this account. Max 255 characters.",
      optional: true,
    },
    Sic: {
      type: "string",
      label: "SIC Code",
      description:
        "Standard Industrial Classification code of the company's main business categorization, for example, 57340 for Electronics. Max 20 characters.",
      optional: true,
    },
    SicDesc: {
      type: "string",
      label: "SIC Description",
      description:
        "A brief description of an org's line of business, based on its SIC code. Max 80 characters.",
      optional: true,
    },
    Site: {
      type: "string",
      label: "Account Site",
      description:
        "Name of the account's location, for example Headquarters or London. Max 80 characters.",
      optional: true,
    },
    TickerSymbol: {
      type: "string",
      label: "Ticker Symbol",
      description:
        "The stock market symbol for this account. Maximum of 20 characters.",
      optional: true,
    },
    Tradestyle: {
      type: "string",
      label: "Tradestyle",
      description:
        "A name, different from its legal name, that an org may use for conducting business. Similar to “Doing business as” or “DBA”. Max 255 characters.",
      optional: true,
    },
    Type: {
      type: "string",
      label: "Account Type",
      description: "Type of account.",
      optional: true,
      options: [
        "Prospect",
        "Customer - Direct",
        "Customer - Channel",
        "Channel Partner / Reseller",
        "Installation Partner",
        "Technology Partner",
        "Other",
      ],
    },
    YearStarted: {
      type: "string",
      label: "Year Started",
      description:
        "The year when an org was legally established. Max 4 characters",
      optional: true,
    },
  },
};
