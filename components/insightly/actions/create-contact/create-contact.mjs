import insightly from "../../insightly.app.mjs";

export default {
  key: "insightly-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See documentation](https://api.insightly.com/v3.1/Help?#!/Contacts/AddEntity)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    insightly,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact.",
      optional: true,
    },
    addressStreet: {
      type: "string",
      label: "Street Address",
      description: "The street address of the contact.",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "City",
      description: "The city of the contact.",
      optional: true,
    },
    addressState: {
      type: "string",
      label: "State",
      description: "The state of the contact.",
      optional: true,
    },
    addressPostcode: {
      type: "string",
      label: "Postcode",
      description: "The zip code/postcode of the contact.",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Country",
      description: "The country of the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      FIRST_NAME: this.firstName,
      LAST_NAME: this.lastName,
      EMAIL_ADDRESS: this.email,
      TITLE: this.title,
      PHONE: this.phone,
      ADDRESS_MAIL_STREET: this.addressStreet,
      ADDRESS_MAIL_CITY: this.addressCity,
      ADDRESS_MAIL_STATE: this.addressState,
      ADDRESS_MAIL_POSTCODE: this.addressPostcode,
      ADDRESS_MAIL_COUNTRY: this.addressCountry,
    };

    const response = await this.insightly.createContact({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.CONTACT_ID}.`);
    }

    return response;
  },
};
