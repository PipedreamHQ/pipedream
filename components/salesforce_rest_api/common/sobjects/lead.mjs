import {
  CLEAN_STATUS_OPTIONS, GEOCODE_ACCURACY_OPTIONS, RECORD_SOURCE_OPTIONS,
} from "../constants-props.mjs";
import commonProps from "../props-async-options.mjs";

export default {
  createProps: {
    IsConverted: {
      type: "boolean",
      label: "Converted",
      description: "Indicates whether the lead has been converted",
      optional: true,
    },
  },
  initialProps: {
    Company: {
      type: "string",
      label: "Company",
      description: "The lead's company.",
    },
    Description: {
      type: "string",
      label: "Description",
      description: "The lead's description.",
      optional: true,
    },
    Email: {
      type: "string",
      label: "Email",
      description: "The lead's email address.",
      optional: true,
    },
    FirstName: {
      type: "string",
      label: "First Name",
      description: "The lead's first name.",
      optional: true,
    },
    LastName: {
      type: "string",
      label: "Last Name",
      description: "The lead's last name.",
    },
    Phone: {
      type: "string",
      label: "Phone",
      description: "The lead's phone number.",
      optional: true,
    },
  },
  extraProps: {
    ConvertedAccountId: {
      ...commonProps.AccountId,
      label: "Converted Account ID",
      description: "The account into which the lead converted.",
      optional: true,
    },
    ConvertedContactId: {
      ...commonProps.ContactId,
      label: "Converted Contact ID",
      description: "The contact into which the lead converted.",
      optional: true,
    },
    ConvertedOpportunityId: {
      ...commonProps.OpportunityId,
      label: "Converted Opportunity ID",
      description: "The opportunity into which the lead converted.",
      optional: true,
    },
    IndividualId: {
      ...commonProps.IndividualId,
      label: "Individual ID",
      description: "ID of the data privacy record associated with this lead.",
      optional: true,
    },
    OwnerId: {
      ...commonProps.UserId,
      label: "Owner ID",
      description: "ID of the lead's owner.",
      optional: true,
    },
    RecordTypeId: {
      ...commonProps.RecordTypeId,
      optional: true,
    },
    AnnualRevenue: {
      type: "string",
      label: "Annual Revenue",
      description: "Annual revenue for the lead's company.",
      optional: true,
    },
    City: {
      type: "string",
      label: "City",
      description: "City for the lead's address.",
      optional: true,
    },
    CleanStatus: {
      type: "string",
      label: "Clean Status",
      description:
        "Indicates the record's clean status compared with Data.com.",
      options: CLEAN_STATUS_OPTIONS,
    },
    CompanyDunsNumber: {
      type: "string",
      label: "Company D-U-N-S Number",
      description:
        "The Data Universal Numbering System (D-U-N-S) number (max 9 characters).",
      optional: true,
    },
    Country: {
      type: "string",
      label: "Country",
      description: "The lead's country.",
      optional: true,
    },
    Fax: {
      type: "string",
      label: "Fax",
      description: "The lead's fax number.",
      optional: true,
    },
    HasOptedOutOfFax: {
      type: "boolean",
      label: "Fax Opt Out",
      description:
        "Indicates whether the lead doesn't want to receive faxes from Salesforce (`true`) or not (`false`)",
      optional: true,
    },
    GeocodeAccuracy: {
      type: "string",
      label: "Geocode Accuracy",
      description: "Accuracy level of the geocode for the address.",
      optional: true,
      options: GEOCODE_ACCURACY_OPTIONS,
    },
    Industry: {
      type: "string",
      label: "Industry",
      description: "Industry in which the lead works.",
      optional: true,
    },
    IsUnreadByOwner: {
      type: "boolean",
      label: "Unread by Owner",
      description: "If true, lead has been assigned, but not yet viewed.",
      optional: true,
    },
    Latitude: {
      type: "string",
      label: "Latitude",
      description:
        "A number between -90 and 90 with up to 15 decimal places. Use with `Longitude` to specify the precise geolocation of an address.",
      optional: true,
    },
    Longitude: {
      type: "string",
      label: "Longitude",
      description:
        "A number between -180 and 180 with up to 15 decimal places. Use with `Latitude` to specify the precise geolocation of an address.",
      optional: true,
    },
    LeadSource: {
      type: "string",
      label: "Lead Source",
      description: "The lead's source.",
      optional: true,
      options: RECORD_SOURCE_OPTIONS,
    },
    MiddleName: {
      type: "string",
      label: "Middle Name",
      description: "The lead's middle name up to 40 characters.",
      optional: true,
    },
    MobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "The lead's mobile phone number.",
      optional: true,
    },
    NumberOfEmployees: {
      type: "integer",
      label: "Employees",
      description: "Number of employees at the lead's company.",
      optional: true,
    },
    PostalCode: {
      type: "string",
      label: "Zip/Postal Code",
      description: "The lead's postal code.",
      optional: true,
    },
    Rating: {
      type: "string",
      label: "Rating",
      description: "Rating of the lead.",
      optional: true,
      options: [
        "Hot",
        "Warm",
        "Cold",
      ],
    },
    State: {
      type: "string",
      label: "State/Province",
      description: "State for the address of the lead.",
      optional: true,
    },
    Status: {
      type: "string",
      label: "Status",
      description: "Status code for this converted lead.",
      optional: true,
      options: [
        "Open - Not Contacted",
        "Working - Contacted",
        "Closed - Converted",
        "Closed - Not Converted",
      ],
    },
    Street: {
      type: "string",
      label: "Street",
      description: "Street number and name for the address of the lead.",
      optional: true,
    },
    Suffix: {
      type: "string",
      label: "Suffix",
      description: "The lead's name suffix up to 40 characters.",
      optional: true,
    },
    Title: {
      type: "string",
      label: "Title",
      description:
        "Title for the lead, such as CFO or CEO. The maximum size is 128 characters. ",
      optional: true,
    },
    Website: {
      type: "string",
      label: "Website",
      description: "Website for the lead.",
      optional: true,
    },
  },
};
