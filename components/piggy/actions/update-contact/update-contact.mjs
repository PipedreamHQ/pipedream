import app from "../../piggy.app.mjs";

export default {
  name: "Update Contact",
  version: "0.0.1",
  key: "piggy-update-contact",
  description: "Updates a contact. [See the documentation](https://docs.piggy.eu/v3/oauth/contacts#:~:text=Possible%20errors-,Update%20Contact,-Updates%20a%20Contact%27s)",
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
      type: "string",
      label: "Email",
      description: "Email of the contact",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "Last name of the contact",
    },
  },
  async run({ $ }) {
    const response = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data: {
        attributes: {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated contact attribute with ID ${this.contactId}`);
    }

    return response;
  },
};
