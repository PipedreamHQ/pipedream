import app from "../../phoneburner.app.mjs";

export default {
  name: "Create Contact",
  version: "0.0.1",
  key: "phoneburner-create-contact",
  description: "Create a contact. [See the documentation](https://www.phoneburner.com/developer/route_list#contacts)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "The last name of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
    },
  },
  async run({ $ }) {
    const response = await this.app.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        email: this.email,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.contact.user_id}`);
    }

    return response;
  },
};
