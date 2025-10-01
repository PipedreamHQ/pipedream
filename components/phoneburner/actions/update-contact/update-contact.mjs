import app from "../../phoneburner.app.mjs";

export default {
  name: "Update Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "phoneburner-update-contact",
  description: "Update a contact. [See the documentation](https://www.phoneburner.com/developer/route_list#contacts)",
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
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
      contactId: this.contactId,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        email: this.email,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated contact with ID ${response.contact.user_id}`);
    }

    return response;
  },
};
