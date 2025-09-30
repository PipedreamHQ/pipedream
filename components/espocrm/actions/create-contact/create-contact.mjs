import espoCrm from "../../espocrm.app.mjs";

export default {
  key: "espocrm-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Espo CRM. [See the documentation](https://docs.espocrm.com/development/api/crud/#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    espoCrm,
    firstName: {
      type: "string",
      label: "First Name",
      description: "Specify the contact's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Specify the contact's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Specify the contact's email",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Specify the contact's phone number",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street Address",
      description: "Specify the contact's street address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Specify the contact's city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Specify the contact's state/region",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Specify the contact's postal code",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Specify the contact's country",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "Specify the contact's job title",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.espoCrm.createContact({
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddress: this.email,
        phoneNumber: this.phone,
        addressStreet: this.street,
        addressCity: this.city,
        addressState: this.state,
        addressPostalCode: this.postalCode,
        addressCountry: this.country,
        title: this.title,
      },
      $,
    });
    $.export("$summary", `Successfully created contact ${this.firstName} ${this.lastName}.`);
    return response;
  },
};
