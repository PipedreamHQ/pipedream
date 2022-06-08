export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "ID of the account that's the parent of this contact. We recommend that you update up to 50 contacts simultaneously when changing the accounts on contacts enabled for a Customer Portal or partner portal. We also recommend that you make this update after business hours.",
  },
  AssistantName: {
    type: "string",
    label: "Assistant Name",
    description: "The assistant's name.",
  },
  AssistantPhone: {
    type: "string",
    label: "Assistant Phone",
    description: "The assistant's telephone number.",
  },
  Birthdate: {
    type: "string",
    label: "Birth Date",
    description: "The contact's birth date.Filter criteria for report filters, list view filters, and SOQL queries ignore the year portion of the Birthdate field. For example, this SOQL query returns contacts with birthdays later in the year than today:view sourceprint?1SELECT Name, Birthdate2FROM Contact3WHERE Birthdate &gt; TODAY",
  },
  CanAllowPortalSelfReg: {
    type: "boolean",
    label: "Can Allow Portal Self Registration",
    description: "Indicates whether this contact can self-register for your Customer Portal (true) or not (false).",
  },
  CleanStatus: {
    type: "string",
    label: "Clean Status",
    description: "Indicates the record's clean status as compared with Data.com. Values include: Matched, Different, Acknowledged, NotFound, Inactive, Pending, SelectMatch, or Skipped.Several values for CleanStatus appear with different labels on the contact record. Matched appears as In Sync Acknowledged appears as Reviewed Pending appears as Not Compared",
  },
  Department: {
    type: "string",
    label: "Department",
    description: "The contact's department.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "A description of the contact. Label is Contact Description up to 32 KB.",
  },
  DoNotCall: {
    type: "boolean",
    label: "Do Not Call",
    description: "Indicates that the contact does not want to receive calls.",
  },
  Email: {
    type: "string",
    label: "Email",
    description: "The contact's email address.",
  },
  EmailBouncedDate: {
    type: "string",
    label: "Email Bounced Date",
    description: "If bounce management is activated and an email sent to the contact bounces, the date and time of the bounce.",
  },
  EmailBouncedReason: {
    type: "string",
    label: "Email Bounced Reason",
    description: "If bounce management is activated and an email sent to the contact bounces, the reason for the bounce.",
  },
  Fax: {
    type: "string",
    label: "Fax",
    description: "The contact's fax number. Label is Business Fax.",
  },
  FirstName: {
    type: "string",
    label: "First Name",
    description: "The contact's first name up to 40 characters.",
  },
  HasOptedOutOfEmail: {
    type: "boolean",
    label: "Has Opted Out Of Email",
    description: "Indicates whether the contact doesn't want to receive email from Salesforce (true) or does (false). Label is Email Opt Out.",
  },
  HasOptedOutOfFax: {
    type: "boolean",
    label: "Has Opted Out Of Fax",
    description: "Indicates whether the contact prohibits receiving faxes.",
  },
  HomePhone: {
    type: "string",
    label: "Home Phone",
    description: "The contact's home telephone number.",
  },
  IndividualId: {
    type: "string",
    label: "Individual ID",
    description: "ID of the data privacy record associated with this contact. This field is available if Data Protection and Privacy is enabled.",
  },
  Jigsaw: {
    type: "string",
    label: "Jigsaw",
    description: "References the company's ID in Data.com. If an account has a value in this field, it means that the account was imported from Data.com. If the field value is null, the account was not imported from Data.com. Maximum size is 20 characters. Available in API version 22.0 and later. Label is Data.com Key. Important The Jigsaw field is exposed in the API to support troubleshooting for import errors and reimporting of corrected data. Do not modify this value.",
  },
  LeadSource: {
    type: "string",
    label: "Lead Source",
    description: "The lead's source.",
  },
  MailingCity: {
    type: "string",
    label: "Mailing City",
    description: "Mailing address details.",
  },
  MailingState: {
    type: "string",
    label: "Mailing State",
    description: "Mailing address details.",
  },
  MailingCountry: {
    type: "string",
    label: "Mailing Country",
    description: "Mailing address details.",
  },
  MailingPostalCode: {
    type: "string",
    label: "Mailing Postal Code",
    description: "Mailing address details.",
  },
  MailingCountryCode: {
    type: "string",
    label: "Mailing Country Code",
    description: "The ISO codes for the mailing address's country.",
  },
  MailingStateCode: {
    type: "string",
    label: "Mailing State Code",
    description: "The ISO codes for the mailing address's state.",
  },
  MailingStreet: {
    type: "string",
    label: "Mailing Street",
    description: "Street address for mailing address.",
  },
  MailingGeocodeAccuracy: {
    type: "string",
    label: "Mailing Geocode Accuracy",
    description: "Accuracy level of the geocode for the mailing address. For details on geolocation compound field, see Compound Field Considerations and Limitations.",
  },
  MailingLatitude: {
    type: "integer",
    label: "Mailing Latitude",
    description: "Used with MailingLongitude to specify the precise geolocation of a mailing address. Acceptable values are numbers between 90 and 90 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
  },
  MailingLongitude: {
    type: "integer",
    label: "Mailing Longitude",
    description: "Used with MailingLatitude to specify the precise geolocation of a mailing address. Acceptable values are numbers between 180 and 180 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
  },
  MiddleName: {
    type: "string",
    label: "Middle Name",
    description: "The contact's middle name up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
  },
  MobilePhone: {
    type: "string",
    label: "Mobile Phone",
    description: "Contact's mobile phone number.",
  },
  OtherCity: {
    type: "string",
    label: "Other City",
    description: "Alternate address details.",
  },
  OtherCountry: {
    type: "string",
    label: "Other Country",
    description: "Alternate address details.",
  },
  OtherPostalCode: {
    type: "string",
    label: "Other Postal Code",
    description: "Alternate address details.",
  },
  OtherState: {
    type: "string",
    label: "Other State",
    description: "Alternate address details.",
  },
  OtherCountryCode: {
    type: "string",
    label: "Other Country Code",
    description: "The ISO code for the alternate country's address .",
  },
  OtherStateCode: {
    type: "string",
    label: "Other State Code",
    description: "The ISO code for the alternate state's address.",
  },
  OtherGeocodeAccuracy: {
    type: "string",
    label: "Other Geocode Accuracy",
    description: "Accuracy level of the geocode for the other address. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
  },
  OtherLatitude: {
    type: "integer",
    label: "Other Latitude",
    description: "Used with Other Longitude to specify the precise geolocation of an alternate address. Acceptable values are numbers between 90 and 90 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
  },
  OtherLongitude: {
    type: "integer",
    label: "Other Longitude",
    description: "Used with Other Latitude to specify the precise geolocation of an alternate address. Acceptable values are numbers between 180 and 180 up to 15 decimal places. For details on geolocation compound fields, see Compound Field Considerations and Limitations.",
  },
  OtherPhone: {
    type: "string",
    label: "Other Phone",
    description: "Telephone for alternate address.",
  },
  OtherStreet: {
    type: "string",
    label: "Other Street",
    description: "Street for alternate address.",
  },
  OwnerId: {
    type: "string",
    label: "Owner ID",
    description: "The ID of the owner of the account associated with this contact.",
  },
  Phone: {
    type: "string",
    label: "Phone",
    description: "Telephone number for the contact. Label is Business Phone.",
  },
  RecordTypeId: {
    type: "string",
    label: "Record Type ID",
    description: "ID of the record type assigned to this object.",
  },
  ReportsToId: {
    type: "string",
    label: "Reports To ID",
    description: "This field doesn't appear if IsPersonAccount is true.",
  },
  Salutation: {
    type: "string",
    label: "Salutation",
    description: "Honorific abbreviation, word, or phrase to be used in front of name in greetings, such as Dr. or Mrs.",
  },
  Suffix: {
    type: "string",
    label: "Suffix",
    description: "Name suffix of the contact up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
  },
  Title: {
    type: "string",
    label: "Title",
    description: "Title of the contact, such as CEO or Vice President.",
  },
};
