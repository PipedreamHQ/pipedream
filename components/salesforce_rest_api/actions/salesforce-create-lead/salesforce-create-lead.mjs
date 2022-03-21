// legacy_hash_id: a_jQiWR4
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-lead",
  name: "Create Lead",
  description: "Creates a lead, which represents a prospect or lead.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    Company: {
      type: "string",
      description: "Required. The lead's company. Note If person account record types have been enabled, and if the value of Company is null, the lead converts to a person account.",
    },
    LastName: {
      type: "string",
      description: "Required. Last name of the lead up to 80 characters.",
    },
    AnnualRevenue: {
      type: "string",
      description: "Annual revenue for the lead's company.",
      optional: true,
    },
    City: {
      type: "string",
      description: "City for the lead's address.",
      optional: true,
    },
    CleanStatus: {
      type: "string",
      description: "Indicates the record's clean status compared with Data.com. Values include: Matched, Different, Acknowledged, NotFound, Inactive, Pending, SelectMatch, or Skipped.Several values for CleanStatus appear with different labels on the lead record. Matched appears as In Sync Acknowledged appears as Reviewed Pending appears as Not Compared",
      optional: true,
    },
    CompanyDunsNumber: {
      type: "string",
      description: "The Data Universal Numbering System (D-U-N-S) number, which is a unique, nine-digit number assigned to every business location in the Dun &amp; Bradstreet database that has a unique, separate, and distinct operation. Industries and companies use D-U-N-S numbers as a global standard for business identification and tracking. Maximum size is 9 characters. Note This field is only available to organizations that use Data.com Prospector or Data.com Clean.",
      optional: true,
    },
    Country: {
      type: "string",
      description: "The lead's country.",
      optional: true,
    },
    CountryCode: {
      type: "string",
      description: "The ISO country code for the lead's address.",
      optional: true,
    },
    CurrencyIsoCode: {
      type: "string",
      description: "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
      optional: true,
    },
    Description: {
      type: "string",
      description: "The lead's description.",
      optional: true,
    },
    Email: {
      type: "string",
      description: "The lead's email address.",
      optional: true,
    },
    Fax: {
      type: "string",
      description: "The lead's fax number.",
      optional: true,
    },
    FirstName: {
      type: "string",
      description: "The lead's first name up to 40 characters.",
      optional: true,
    },
    HasOptedOutOfEmail: {
      type: "boolean",
      description: "Indicates whether the lead doesn't want to receive email from Salesforce (true) or does (false). Label is Email Opt Out.",
      optional: true,
    },
    GeocodeAccuracy: {
      type: "string",
      description: "Accuracy level of the geocode for the address. For details on geolocation compound fields, see [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations).",
      optional: true,
    },
    IndividualId: {
      type: "string",
      description: "ID of the data privacy record associated with this lead. This field is available if you enabled Data Protection and Privacy in Setup.",
      optional: true,
    },
    Industry: {
      type: "string",
      description: "Industry in which the lead works.",
      optional: true,
    },
    IsConverted: {
      type: "boolean",
      description: "Indicates whether the lead has been converted (true) or not (false). Label is Converted.",
      optional: true,
    },
    IsUnreadByOwner: {
      type: "boolean",
      description: "If true, lead has been assigned, but not yet viewed. See Unread Leads for more information. Label is Unread By Owner.",
      optional: true,
    },
    Jigsaw: {
      type: "string",
      description: "References the ID of a contact in Data.com. If a lead has a value in this field, it means that a contact was imported as a lead from Data.com. If the contact (converted to a lead) was not imported from Data.com, the field value is null. Maximum size is 20 characters.",
      optional: true,
    },
    Latitude: {
      type: "integer",
      description: "Used with Longitude to specify the precise geolocation of an address. Acceptable values are numbers between 90 and 90 up to 15 decimal places. For details on geolocation compound fields, see [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations).",
      optional: true,
    },
    Longitude: {
      type: "integer",
      description: "Used with Latitude to specify the precise geolocation of an address. Acceptable values are numbers between 180 and 180 up to 15 decimal places. For details on geolocation compound fields, see [Compound Field Considerations and Limitations](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/compound_fields_limitations.htm#compound_fields_limitations).",
      optional: true,
    },
    LeadSource: {
      type: "string",
      description: "The lead's source.",
      optional: true,
    },
    MiddleName: {
      type: "string",
      description: "The lead's middle name up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
      optional: true,
    },
    MobilePhone: {
      type: "string",
      description: "The lead's mobile phone number.",
      optional: true,
    },
    NumberOfEmployees: {
      type: "integer",
      description: "Number of employees at the lead's company. Label is Employees.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      description: "ID of the lead's owner.",
      optional: true,
    },
    Phone: {
      type: "string",
      description: "The lead's phone number.",
      optional: true,
    },
    PostalCode: {
      type: "string",
      description: "Postal code for the address of the lead.",
      optional: true,
    },
    Rating: {
      type: "string",
      description: "Rating of the lead.",
      optional: true,
    },
    RecordTypeId: {
      type: "string",
      description: "ID of the record type assigned to this object.",
      optional: true,
    },
    Salutation: {
      type: "string",
      description: "Salutation for the lead.",
      optional: true,
    },
    State: {
      type: "string",
      description: "State for the address of the lead.",
      optional: true,
    },
    StateCode: {
      type: "string",
      description: "The ISO state code for the lead's address.",
      optional: true,
    },
    Status: {
      type: "string",
      description: "Status code for this converted lead. Status codes are defined in Status and represented in the API by the LeadStatus object.",
      optional: true,
    },
    Street: {
      type: "string",
      description: "Street number and name for the address of the lead.",
      optional: true,
    },
    Suffix: {
      type: "string",
      description: "The lead's name suffix up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
      optional: true,
    },
    Title: {
      type: "string",
      description: "Title for the lead, such as CFO or CEO.",
      optional: true,
    },
    Website: {
      type: "string",
      description: "Website for the lead.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
  // Lead object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_lead.htm

    if (!this.Company || !this.LastName) {
      throw new Error("Must provide Company and LastName parameters.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/Lead/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
      "data": {
        AnnualRevenue: this.AnnualRevenue,
        City: this.City,
        CleanStatus: this.CleanStatus,
        Company: this.Company,
        CompanyDunsNumber: this.CompanyDunsNumber,
        Country: this.Country,
        CountryCode: this.CountryCode,
        CurrencyIsoCode: this.CurrencyIsoCode,
        Description: this.Description,
        Email: this.Email,
        Fax: this.Fax,
        FirstName: this.FirstName,
        HasOptedOutOfEmail: this.HasOptedOutOfEmail,
        GeocodeAccuracy: this.GeocodeAccuracy,
        IndividualId: this.IndividualId,
        Industry: this.Industry,
        IsConverted: this.IsConverted,
        IsUnreadByOwner: this.IsUnreadByOwner,
        Jigsaw: this.Jigsaw,
        LastName: this.LastName,
        Latitude: this.Latitude,
        Longitude: this.Longitude,
        LeadSource: this.LeadSource,
        MiddleName: this.MiddleName,
        MobilePhone: this.MobilePhone,
        NumberOfEmployees: this.NumberOfEmployees,
        OwnerId: this.OwnerId,
        Phone: this.Phone,
        PostalCode: this.PostalCode,
        Rating: this.Rating,
        RecordTypeId: this.RecordTypeId,
        Salutation: this.Salutation,
        State: this.State,
        StateCode: this.StateCode,
        Status: this.Status,
        Street: this.Street,
        Suffix: this.Suffix,
        Title: this.Title,
        Website: this.Website,
      },
    });
  },
};
