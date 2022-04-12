export default {
  AnnualRevenue: {
    type: "string",
    label: "AnnualRevenue",
    description: "Annual revenue for the lead's company.",
  },
  City: {
    type: "string",
    label: "City",
    description: "City for the lead's address.",
  },
  CleanStatus: {
    type: "string",
    label: "CleanStatus",
    description: "Indicates the record's clean status compared with Data.com. Values include: Matched, Different, Acknowledged, NotFound, Inactive, Pending, SelectMatch, or Skipped.Several values for CleanStatus appear with different labels on the lead record. Matched appears as In Sync Acknowledged appears as Reviewed Pending appears as Not Compared",
  },
  CompanyDunsNumber: {
    type: "string",
    label: "CompanyDunsNumber",
    description: "The Data Universal Numbering System (D-U-N-S) number, which is a unique, nine-digit number assigned to every business location in the Dun &amp; Bradstreet database that has a unique, separate, and distinct operation. Industries and companies use D-U-N-S numbers as a global standard for business identification and tracking. Maximum size is 9 characters. Note This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
  },
  Country: {
    type: "string",
    label: "Country",
    description: "The lead's country.",
  },
  CountryCode: {
    type: "string",
    label: "CountryCode",
    description: "The ISO country code for the lead's address.",
  },
  CurrencyIsoCode: {
    type: "string",
    label: "CurrencyIsoCode",
    description: "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "The lead's description.",
  },
  Email: {
    type: "string",
    label: "Email",
    description: "The lead's email address.",
  },
  Fax: {
    type: "string",
    label: "Fax",
    description: "The lead's fax number.",
  },
  FirstName: {
    type: "string",
    label: "FirstName",
    description: "The lead's first name up to 40 characters.",
  },
  HasOptedOutOfEmail: {
    type: "boolean",
    label: "HasOptedOutOfEmail",
    description: "Indicates whether the lead doesn't want to receive email from Salesforce (true) or does (false). Label is Email Opt Out.",
  },
  GeocodeAccuracy: {
    type: "string",
    label: "GeocodeAccuracy",
    description: "Accuracy level of the geocode for the address. For details on geolocation compound fields, see [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations).",
  },
  IndividualId: {
    type: "string",
    label: "IndividualId",
    description: "ID of the data privacy record associated with this lead. This field is available if you enabled Data Protection and Privacy in Setup.",
  },
  Industry: {
    type: "string",
    label: "Industry",
    description: "Industry in which the lead works.",
  },
  IsConverted: {
    type: "boolean",
    label: "IsConverted",
    description: "Indicates whether the lead has been converted (true) or not (false). Label is Converted.",
  },
  IsUnreadByOwner: {
    type: "boolean",
    label: "IsUnreadByOwner",
    description: "If true, lead has been assigned, but not yet viewed. See Unread Leads for more information. Label is Unread By Owner.",
  },
  Jigsaw: {
    type: "string",
    label: "Jigsaw",
    description: "References the ID of a contact in Data.com. If a lead has a value in this field, it means that a contact was imported as a lead from Data.com. If the contact (converted to a lead) was not imported from Data.com, the field value is null. Maximum size is 20 characters.",
  },
  Latitude: {
    type: "integer",
    label: "Latitude",
    description: "Used with Longitude to specify the precise geolocation of an address. Acceptable values are numbers between 90 and 90 up to 15 decimal places. For details on geolocation compound fields, see [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations).",
  },
  Longitude: {
    type: "integer",
    label: "Longitude",
    description: "Used with Latitude to specify the precise geolocation of an address. Acceptable values are numbers between 180 and 180 up to 15 decimal places. For details on geolocation compound fields, see [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations).",
  },
  LeadSource: {
    type: "string",
    label: "LeadSource",
    description: "The lead's source.",
  },
  MiddleName: {
    type: "string",
    label: "MiddleName",
    description: "The lead's middle name up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
  },
  MobilePhone: {
    type: "string",
    label: "MobilePhone",
    description: "The lead's mobile phone number.",
  },
  NumberOfEmployees: {
    type: "integer",
    label: "NumberOfEmployees",
    description: "Number of employees at the lead's company. Label is Employees.",
  },
  OwnerId: {
    type: "string",
    label: "OwnerId",
    description: "ID of the lead's owner.",
  },
  Phone: {
    type: "string",
    label: "Phone",
    description: "The lead's phone number.",
  },
  PostalCode: {
    type: "string",
    label: "PostalCode",
    description: "Postal code for the address of the lead.",
  },
  Rating: {
    type: "string",
    label: "Rating",
    description: "Rating of the lead.",
  },
  RecordTypeId: {
    type: "string",
    label: "RecordTypeId",
    description: "ID of the record type assigned to this object.",
  },
  Salutation: {
    type: "string",
    label: "Salutation",
    description: "Salutation for the lead.",
  },
  State: {
    type: "string",
    label: "State",
    description: "State for the address of the lead.",
  },
  StateCode: {
    type: "string",
    label: "StateCode",
    description: "The ISO state code for the lead's address.",
  },
  Status: {
    type: "string",
    label: "Status",
    description: "Status code for this converted lead. Status codes are defined in Status and represented in the API by the LeadStatus object.",
  },
  Street: {
    type: "string",
    label: "Street",
    description: "Street number and name for the address of the lead.",
  },
  Suffix: {
    type: "string",
    label: "Suffix",
    description: "The lead's name suffix up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
  },
  Title: {
    type: "string",
    label: "Title",
    description: "Title for the lead, such as CFO or CEO.",
  },
  Website: {
    type: "string",
    label: "Website",
    description: "Website for the lead.",
  },
};
