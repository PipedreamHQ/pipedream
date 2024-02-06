import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-create-contact",
  name: "Create Contact",
  description: "Add a new contact. [See the documentation](https://developer.teamleader.eu/#/reference/crm/contacts/contacts.add)",
  version: "0.0.2",
  type: "action",
  props: {
    teamleaderFocus,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the new contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the new contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new contact",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the new contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the new contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      website: this.website,
    };
    if (this.email) {
      data.emails = [
        {
          type: "primary",
          email: this.email,
        },
      ];
    }
    if (this.phone) {
      data.telephones = [
        {
          type: "phone",
          number: this.phone,
        },
      ];
    }

    const response = await this.teamleaderFocus.createContact({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.data.id}`);
    }

    return response;
  },
};
