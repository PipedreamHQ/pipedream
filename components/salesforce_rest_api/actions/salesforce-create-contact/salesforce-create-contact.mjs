// legacy_hash_id: a_k6iK7L
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-contact",
  name: "Create Contact",
  description: "Creates a Contact, which is a person associated with an account.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    LastName: {
      type: "string",
      description: "Required. Last name of the contact up to 80 characters.",
    },
    AccountId: {
      type: "string",
      description: "ID of the account that's the parent of this contact. We recommend that you update up to 50 contacts simultaneously when changing the accounts on contacts enabled for a Customer Portal or partner portal. We also recommend that you make this update after business hours.",
      optional: true,
    },
    AssistantName: {
      type: "string",
      description: "The assistant's name.",
      optional: true,
    },
    AssistantPhone: {
      type: "string",
      description: "The assistant's telephone number.",
      optional: true,
    },
    Birthdate: {
      type: "string",
      description: "The contact's birthdate.Filter criteria for report filters, list view filters, and SOQL queries ignore the year portion of the Birthdate field. For example, this SOQL query returns contacts with birthdays later in the year than today:view sourceprint?1SELECT Name, Birthdate2FROM Contact3WHERE Birthdate &gt; TODAY",
      optional: true,
    },
    CanAllowPortalSelfReg: {
      type: "boolean",
      description: "Indicates whether this contact can self-register for your Customer Portal (true) or not (false).",
      optional: true,
    },
    CleanStatus: {
      type: "string",
      description: "Indicates the record's clean status as compared with Data.com. Values include: Matched, Different, Acknowledged, NotFound, Inactive, Pending, SelectMatch, or Skipped.Several values for CleanStatus appear with different labels on the contact record. Matched appears as In Sync Acknowledged appears as Reviewed Pending appears as Not Compared",
      optional: true,
    },
    Department: {
      type: "string",
      description: "The contact's department.",
      optional: true,
    },
    Description: {
      type: "string",
      description: "A description of the contact. Label is Contact Description up to 32 KB.",
      optional: true,
    },
    DoNotCall: {
      type: "boolean",
      description: "Indicates that the contact does not want to receive calls.",
      optional: true,
    },
    Email: {
      type: "string",
      description: "The contact's email address.",
      optional: true,
    },
    EmailBouncedDate: {
      type: "string",
      description: "If bounce management is activated and an email sent to the contact bounces, the date and time of the bounce.",
      optional: true,
    },
    EmailBouncedReason: {
      type: "string",
      description: "If bounce management is activated and an email sent to the contact bounces, the reason for the bounce.",
      optional: true,
    },
    Fax: {
      type: "string",
      description: "The contact's fax number. Label is Business Fax.",
      optional: true,
    },
    FirstName: {
      type: "string",
      description: "The contact's first name up to 40 characters.",
      optional: true,
    },
    HasOptedOutOfEmail: {
      type: "boolean",
      description: "Indicates whether the contact doesn't want to receive email from Salesforce (true) or does (false). Label is Email Opt Out.",
      optional: true,
    },
    HasOptedOutOfFax: {
      type: "boolean",
      description: "Indicates whether the contact prohibits receiving faxes.",
      optional: true,
    },
    HomePhone: {
      type: "string",
      description: "The contact's home telephone number.",
      optional: true,
    },
    IndividualId: {
      type: "string",
      description: "ID of the data privacy record associated with this contact. This field is available if Data Protection and Privacy is enabled.",
      optional: true,
    },
    Jigsaw: {
      type: "string",
      description: "References the company's ID in Data.com. If an account has a value in this field, it means that the account was imported from Data.com. If the field value is null, the account was not imported from Data.com. Maximum size is 20 characters. Available in API version 22.0 and later. Label is Data.com Key. Important The Jigsaw field is exposed in the API to support troubleshooting for import errors and reimporting of corrected data. Do not modify this value.",
      optional: true,
    },
    LeadSource: {
      type: "string",
      description: "The lead's source.",
      optional: true,
    },
    MailingCity: {
      type: "string",
      description: "Mailing address details.",
      optional: true,
    },
    MailingState: {
      type: "string",
      description: "Mailing address details.",
      optional: true,
    },
    MailingCountry: {
      type: "string",
      description: "Mailing address details.",
      optional: true,
    },
    MailingPostalCode: {
      type: "string",
      description: "Mailing address details.",
      optional: true,
    },
    MailingCountryCode: {
      type: "string",
      description: "The ISO codes for the mailing address's country.",
      optional: true,
    },
    MailingStateCode: {
      type: "string",
      description: "The ISO codes for the mailing address's state.",
      optional: true,
    },
    MailingStreet: {
      type: "string",
      description: "Street address for mailing address.",
      optional: true,
    },
    MailingGeocodeAccuracy: {
      type: "string",
      description: "Accuracy level of the geocode for the mailing address. For details on geolocation compound field, see Compound Field Considerations and Limitations.",
      optional: true,
    },
    MailingLatitude: {
      type: "integer",
      description: "Used with MailingLongitude to specify the precise geolocation of a mailing address. Acceptable values are numbers between 90 and 90 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
      optional: true,
    },
    MailingLongitude: {
      type: "integer",
      description: "Used with MailingLatitude to specify the precise geolocation of a mailing address. Acceptable values are numbers between 180 and 180 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
      optional: true,
    },
    MiddleName: {
      type: "string",
      description: "The contact's middle name up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
      optional: true,
    },
    MobilePhone: {
      type: "string",
      description: "Contact's mobile phone number.",
      optional: true,
    },
    OtherCity: {
      type: "string",
      description: "Alternate address details.",
      optional: true,
    },
    OtherCountry: {
      type: "string",
      description: "Alternate address details.",
      optional: true,
    },
    OtherPostalCode: {
      type: "string",
      description: "Alternate address details.",
      optional: true,
    },
    OtherState: {
      type: "string",
      description: "Alternate address details.",
      optional: true,
    },
    OtherCountryCode: {
      type: "string",
      description: "The ISO codes for the alternate address's country.",
      optional: true,
    },
    OtherStateCode: {
      type: "string",
      description: "The ISO codes for the alternate address's state.",
      optional: true,
    },
    OtherGeocodeAccuracy: {
      type: "string",
      description: "Accuracy level of the geocode for the other address. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
      optional: true,
    },
    OtherLatitude: {
      type: "integer",
      description: "Used with OtherLongitude to specify the precise geolocation of an alternate address. Acceptable values are numbers between 90 and 90 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
      optional: true,
    },
    OtherLongitude: {
      type: "integer",
      description: "Used with OtherLatitude to specify the precise geolocation of an alternate address. Acceptable values are numbers between 180 and 180 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
      optional: true,
    },
    OtherPhone: {
      type: "string",
      description: "Telephone for alternate address.",
      optional: true,
    },
    OtherStreet: {
      type: "string",
      description: "Street for alternate address.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      description: "The ID of the owner of the account associated with this contact.",
      optional: true,
    },
    Phone: {
      type: "string",
      description: "Telephone number for the contact. Label is Business Phone.",
      optional: true,
    },
    RecordTypeId: {
      type: "string",
      description: "ID of the record type assigned to this object.",
      optional: true,
    },
    ReportsToId: {
      type: "string",
      description: "This field doesn't appear if IsPersonAccount is true.",
      optional: true,
    },
    Salutation: {
      type: "string",
      description: "Honorific abbreviation, word, or phrase to be used in front of name in greetings, such as Dr. or Mrs.",
      optional: true,
    },
    Suffix: {
      type: "string",
      description: "Name suffix of the contact up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
      optional: true,
    },
    Title: {
      type: "string",
      description: "Title of the contact, such as CEO or Vice President.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
  // Contact object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_contact.htm

    if (!this.LastName) {
      throw new Error("Must provide LastNameRo parameter.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/Contact/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
      "data": {
        AccountId: this.AccountId,
        AssistantName: this.AssistantName,
        AssistantPhone: this.AssistantPhone,
        Birthdate: this.Birthdate,
        CanAllowPortalSelfReg: this.CanAllowPortalSelfReg,
        CleanStatus: this.CleanStatus,
        Department: this.Department,
        Description: this.Description,
        DoNotCall: this.DoNotCall,
        Email: this.Email,
        EmailBouncedDate: this.EmailBouncedDate,
        EmailBouncedReason: this.EmailBouncedReason,
        Fax: this.Fax,
        FirstName: this.FirstName,
        HasOptedOutOfEmail: this.HasOptedOutOfEmail,
        HasOptedOutOfFax: this.HasOptedOutOfFax,
        HomePhone: this.HomePhone,
        IndividualId: this.IndividualId,
        Jigsaw: this.Jigsaw,
        LastName: this.LastName,
        LeadSource: this.LeadSource,
        MailingCity: this.MailingCity,
        MailingState: this.MailingState,
        MailingCountry: this.MailingCountry,
        MailingPostalCode: this.MailingPostalCode,
        MailingCountryCode: this.MailingCountryCode,
        MailingStateCode: this.MailingStateCode,
        MailingStreet: this.MailingStreet,
        MailingGeocodeAccuracy: this.MailingGeocodeAccuracy,
        MailingLatitude: this.MailingLatitude,
        MailingLongitude: this.MailingLongitude,
        MiddleName: this.MiddleName,
        MobilePhone: this.MobilePhone,
        OtherCity: this.OtherCity,
        OtherCountry: this.OtherCountry,
        OtherPostalCode: this.OtherPostalCode,
        OtherState: this.OtherState,
        OtherCountryCode: this.OtherCountryCode,
        OtherStateCode: this.OtherStateCode,
        OtherGeocodeAccuracy: this.OtherGeocodeAccuracy,
        OtherLatitude: this.OtherLatitude,
        OtherLongitude: this.OtherLongitude,
        OtherPhone: this.OtherPhone,
        OtherStreet: this.OtherStreet,
        OwnerId: this.OwnerId,
        Phone: this.Phone,
        RecordTypeId: this.RecordTypeId,
        ReportsToId: this.ReportsToId,
        Salutation: this.Salutation,
        Suffix: this.Suffix,
        Title: this.Title,
      },
    });
  },
};
