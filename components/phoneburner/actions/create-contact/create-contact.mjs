import app from "../../phoneburner.app.mjs";

export default {
  name: "Create Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "phoneburner-create-contact",
  description: "Create a contact. [See the documentation](https://www.phoneburner.com/developer/route_list#contacts)",
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
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
