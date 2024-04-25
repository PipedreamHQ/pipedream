import sellsy from "../../sellsy.app.mjs";

export default {
  key: "sellsy-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Sellsy. [See the documentation](https://api.sellsy.com/doc/v2/#operation/create-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    sellsy,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note about the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sellsy.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        website: this.website,
        phone_number: this.phone,
        note: this.note,
      },
    });
    $.export("$summary", `Successfully created contact ${this.firstName} ${this.lastName}`);
    return response;
  },
};
