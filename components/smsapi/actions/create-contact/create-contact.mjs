import smsapi from "../../smsapi.app.mjs";
import queryString from "query-string";

export default {
  key: "smsapi-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in SMSAPI. [See the documentation](https://www.smsapi.com/docs/#create-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smsapi,
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
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Birthday of the contact in format `YYYY-MM-DD`",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the contact",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smsapi.createContact({
      data: queryString.stringify({
        first_name: this.firstName,
        last_name: this.lastName,
        phone_number: this.phone,
        email: this.email,
        birthday_date: this.birthday,
        city: this.city,
        description: this.description,
      }),
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created contact with ID ${response.id}.`);
    }

    return response;
  },
};
