import companyhub from "../../companyhub.app.mjs";

export default {
  key: "companyhub-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://companyhub.com/docs/api-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    companyhub,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
      optional: true,
    },
    companyId: {
      propDefinition: [
        companyhub,
        "companyId",
      ],
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
      optional: true,
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "The designation of the contact",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the contact",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the contact",
      optional: true,
      options: [
        "Web",
        "Call",
        "Referral",
        "Other",
      ],
    },
    nextFollowUpDate: {
      type: "string",
      label: "Next Follow Up Date",
      description: "The next follow up date with the contact. E.g. `2025-03-14T00:00:00`",
      optional: true,
    },
    hasOptedOutOfEmails: {
      type: "boolean",
      label: "Has Opted Out of Emails",
      description: "Whether the contact has opted out of emails",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street Address",
      description: "The street address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city where the contact is located",
      optional: true,
    },
    state: {
      type: "string",
      label: "State/Province",
      description: "The state or province where the contact is located",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country where the contact is located",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the contact's address",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.companyhub.createContact({
      $,
      data: {
        FirstName: this.firstName,
        LastName: this.lastName,
        Email: this.email,
        Company: this.companyId,
        Phone: this.phone,
        Designation: this.designation,
        Description: this.description,
        Source: this.source,
        NextFollowUpDate: this.nextFollowUpDate,
        HasOptedOutOfEmails: this.hasOptedOutOfEmails,
        Street: this.street,
        City: this.city,
        State: this.state,
        Country: this.country,
        PostalCode: this.postalCode,
      },
    });
    if (response.Success) {
      $.export("$summary", `Successfully created contact with ID: ${response.Id}`);
    }
    return response;
  },
};
