import {
  CLEAN_STATUS_OPTIONS, GEOCODE_ACCURACY_OPTIONS, RECORD_SOURCE_OPTIONS,
} from "../constants-props.mjs";
import commonProps from "../props-async-options.mjs";

export default {
  initialProps: {
    Description: {
      type: "string",
      label: "Contact Description",
      description: "A description of the contact, up to 32 KB.",
      optional: true,
    },
    Email: {
      type: "string",
      label: "Email",
      description: "The contact's email address.",
      optional: true,
    },
    FirstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name, up to 40 characters.",
      optional: true,
    },
    LastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name, up to 80 characters.",
    },
    Phone: {
      type: "string",
      label: "Business Phone",
      description: "Phone number for the contact.",
      optional: true,
    },
  },
  extraProps: {
    AccountId: {
      ...commonProps.AccountId,
      description: "ID of the account that's the parent of this contact.",
      optional: true,
    },
    IndividualId: {
      ...commonProps.IndividualId,
      optional: true,
    },
    OwnerId: {
      ...commonProps.UserId,
      description:
        "The ID of the owner of the account associated with this contact.",
      optional: true,
    },
    RecordTypeId: {
      ...commonProps.RecordTypeId,
      optional: true,
    },
    ReportsToId: {
      ...commonProps.ContactId,
      label: "Reports To ID",
      optional: true,
    },
    AssistantName: {
      type: "string",
      label: "Assistant's Name",
      description: "The assistant's name.",
      optional: true,
    },
    AssistantPhone: {
      type: "string",
      label: "Assistant's Phone",
      description: "The assistant's phone number.",
      optional: true,
    },
    Birthdate: {
      type: "string",
      label: "Birthdate",
      description: "The contact's birthdate.",
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
    Department: {
      type: "string",
      label: "Department",
      description: "The contact's department.",
      optional: true,
    },
    Fax: {
      type: "string",
      label: "Business Fax",
      description: "The contact's fax number.",
      optional: true,
    },
    HasOptedOutOfEmail: {
      type: "boolean",
      label: "Email Opt Out",
      description:
        "Indicates whether the contact doesn't want to receive email from Salesforce (`true`) or does (`false`).",
      optional: true,
    },
    HasOptedOutOfFax: {
      type: "boolean",
      label: "Fax Opt Out",
      description: "Indicates whether the contact prohibits receiving faxes.",
      optional: true,
    },
    HomePhone: {
      type: "string",
      label: "Home Phone",
      description: "The contact's home phone number.",
      optional: true,
    },
    LeadSource: {
      type: "string",
      label: "Lead Source",
      description: "The source of the lead that was converted to this contact.",
      optional: true,
      options: RECORD_SOURCE_OPTIONS,
    },
    MailingCity: {
      type: "string",
      label: "Mailing City",
      description: "The city of the contact's mailing address.",
      optional: true,
    },
    MailingCountry: {
      type: "string",
      label: "Mailing Country",
      description: "The country of the contact's mailing address.",
      optional: true,
    },
    MailingGeocodeAccuracy: {
      type: "string",
      label: "Mailing Geocode Accuracy",
      description: "Accuracy level of the geocode for the mailing address.",
      optional: true,
      options: GEOCODE_ACCURACY_OPTIONS,
    },
    MailingLatitude: {
      type: "string",
      label: "Mailing Latitude",
      description:
        "A number between -90 and 90 with up to 15 decimal places. Use with `Mailing Longitude` to specify the precise geolocation of a mailing address.",
      optional: true,
    },
    MailingLongitude: {
      type: "string",
      label: "Mailing Longitude",
      description:
        "A number between -180 and 180 with up to 15 decimal places. Use with `Mailing Latitude` to specify the precise geolocation of a mailing address.",
      optional: true,
    },
    MailingPostalCode: {
      type: "string",
      label: "Mailing Postal Code",
      description: "The postal code of the contact's mailing address.",
      optional: true,
    },
    MailingState: {
      type: "string",
      label: "Mailing State",
      description: "The state of the contact's mailing address.",
      optional: true,
    },
    MiddleName: {
      type: "string",
      label: "Middle Name",
      description: "The contact's middle name, up to 40 characters.",
      optional: true,
    },
    MobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "The contact's mobile phone number.",
      optional: true,
    },
    Salutation: {
      type: "string",
      label: "Salutation",
      description: "The contact's salutation.",
      optional: true,
      options: [
        "Mr.",
        "Ms.",
        "Mrs.",
        "Dr.",
        "Prof.",
        "Mx.",
      ],
    },
    Suffix: {
      type: "string",
      label: "Suffix",
      description: "Name suffix of the contact up to 40 characters.",
      optional: true,
    },
    Title: {
      type: "string",
      label: "Title",
      description: "Title of the contact, such as CEO or Vice President.",
      optional: true,
    },
  },
};
