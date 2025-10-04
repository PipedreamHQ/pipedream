import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the documentation](http://dev.wealthbox.com/#contacts-create-a-new-contact-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wealthbox,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The name of the contact’s present company",
      optional: true,
    },
    type: {
      propDefinition: [
        wealthbox,
        "contactType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wealthbox.createContact({
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email_addresses: [
          {
            address: this.email,
          },
        ],
        phone_numbers: [
          {
            address: this.phone,
          },
        ],
        company: this.company,
        contact_type: this.type,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.id}`);
    }

    return response;
  },
};
