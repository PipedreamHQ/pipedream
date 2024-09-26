import agiliron from "../../agiliron.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "agiliron-create-contact",
  name: "Create Contact",
  description: "Generates a new contact within Agiliron. [See the documentation](https://api.agiliron.com/docs/add-contact-1)",
  version: "0.0.1",
  type: "action",
  props: {
    agiliron,
    salutation: {
      propDefinition: [
        agiliron,
        "salutation",
      ],
      optional: true,
    },
    lastname: {
      propDefinition: [
        agiliron,
        "lastname",
      ],
      description: "The last name of the contact.",
    },
    firstName: {
      propDefinition: [
        agiliron,
        "firstName",
      ],
      description: "The first name of the contact",
      optional: true,
    },
    officePhone: {
      type: "string",
      label: "Office Phone",
      description: "The office phone number of the contact",
      optional: true,
    },
    mobile: {
      propDefinition: [
        agiliron,
        "mobile",
      ],
      description: "The mobile number of the contact",
      optional: true,
    },
    homePhone: {
      type: "string",
      label: "Home Phone",
      description: "The home phone number of the contact",
      optional: true,
    },
    otherPhone: {
      type: "string",
      label: "Other Phone",
      description: "An additional phone number of the contact",
      optional: true,
    },
    fax: {
      propDefinition: [
        agiliron,
        "fax",
      ],
      description: "The fax number of the contact",
      optional: true,
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "The account name of the contact",
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The account id of the contact",
      optional: true,
    },
    vendorName: {
      type: "string",
      label: "Vendor Name",
      description: "The vendor name of the contact",
      optional: true,
    },
    vendorId: {
      type: "string",
      label: "Vendor ID",
      description: "The vendor id of the contact",
      optional: true,
    },
    contactType: {
      propDefinition: [
        agiliron,
        "contactType",
      ],
      description: "The contact type of the contact",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department of the contact.",
      optional: true,
    },
    email: {
      propDefinition: [
        agiliron,
        "email",
      ],
      description: "The email address of the contact",
      optional: true,
    },
    yahooId: {
      propDefinition: [
        agiliron,
        "yahooId",
      ],
      description: "The Yahoo ID of the contact",
      optional: true,
    },
    emailOptOut: {
      propDefinition: [
        agiliron,
        "emailOptOut",
      ],
      description: "The email opt-out status of the contact",
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        agiliron,
        "assignedTo",
      ],
      description: "The user to whom the contact is assigned",
      optional: true,
    },
    leadSource: {
      propDefinition: [
        agiliron,
        "leadSource",
      ],
      description: "The lead source of the contact",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The birthday of the contact.",
      optional: true,
    },
    mailingStreet: {
      type: "string",
      label: "Mailing Street",
      description: "The mailing street address of the contact",
      optional: true,
    },
    mailingCity: {
      type: "string",
      label: "Mailing City",
      description: "The mailing city of the contact",
      optional: true,
    },
    mailingState: {
      type: "string",
      label: "Mailing State",
      description: "The mailing state of the contact",
      optional: true,
    },
    mailingZip: {
      type: "string",
      label: "Mailing Zip",
      description: "The mailing zip code of the contact",
      optional: true,
    },
    mailingCountry: {
      type: "string",
      label: "Mailing Country",
      description: "The mailing country of the contact",
      optional: true,
    },
    otherStreet: {
      type: "string",
      label: "Other Street",
      description: "The other street address of the contact",
      optional: true,
    },
    otherCity: {
      type: "string",
      label: "Other City",
      description: "The other city of the contact",
      optional: true,
    },
    otherState: {
      type: "string",
      label: "Other State",
      description: "The other state of the contact",
      optional: true,
    },
    otherZip: {
      type: "string",
      label: "Other Zip",
      description: "The other zip code of the contact",
      optional: true,
    },
    otherCountry: {
      type: "string",
      label: "Other Country",
      description: "The other country of the contact",
      optional: true,
    },
    description: {
      propDefinition: [
        agiliron,
        "description",
      ],
      description: "The description of the contact",
      optional: true,
    },
    customFields: {
      propDefinition: [
        agiliron,
        "customFields",
      ],
      description: "An object of custom fields for the contact. **Format: {customFieldName01: \"Value 01\"}**",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedCustomFields = parseObject(this.customFields);
    const customFields = parsedCustomFields && Object.keys(parsedCustomFields).map((key) => ({
      Name: key,
      value: parsedCustomFields[key],
    }));
    const contact = {
      Salutation: this.salutation,
      LastName: this.lastname,
      FirstName: this.firstName,
      OfficePhone: this.officePhone,
      Mobile: this.mobile,
      HomePhone: this.homePhone,
      OtherPhone: this.otherPhone,
      Fax: this.fax,
      AccountName: this.accountName,
      AccountID: this.accountId,
      VendorName: this.vendorName,
      VendorID: this.vendorId,
      ContactType: this.contactType,
      Title: this.title,
      Department: this.department,
      Email: this.email,
      YahooID: this.yahooId,
      EmailOptOut: this.emailOptOut,
      AssignedTo: this.assignedTo,
      LeadSource: this.leadSource,
      Birthday: this.birthday,
      MailingStreet: this.mailingStreet,
      MailingCity: this.mailingCity,
      MailingState: this.mailingState,
      MailingZip: this.mailingZip,
      MailingCountry: this.mailingCountry,
      OtherStreet: this.otherStreet,
      OtherCity: this.otherCity,
      OtherState: this.otherState,
      OtherZip: this.otherZip,
      OtherCountry: this.otherCountry,
      Description: this.description,
      CustomFields: {
        CustomField: customFields,
      },
    };

    const response = await this.agiliron.addContact({
      $,
      data: {
        "Contacts": {
          "Contact": contact,
        },
      },
    });

    $.export("$summary", `Successfully created contact with Id: ${response?.MCM?.parameters?.results?.message?.success_message?.contact_id}`);
    return response;
  },
};
