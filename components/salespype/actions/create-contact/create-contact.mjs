import salespype from "../../salespype.app.mjs";

export default {
  key: "salespype-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Salespype. [See the documentation](https://documenter.getpostman.com/view/5101444/2s93Y3u1Eb#0a9f8441-c7fa-48dc-b02b-0117037d86ab)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salespype,
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
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP Code",
      description: "The ZIP code of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birthdate",
      description: "The birthdate of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const contact = await this.salespype.createContact({
      $,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        companyName: this.companyName,
        birthDate: this.birthDate,
      },
    });
    $.export("$summary", `Created contact ${this.firstName} ${this.lastName} (${this.email})`);
    return contact;
  },
};
