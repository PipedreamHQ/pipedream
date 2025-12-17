import app from "../../zoho_bigin.app.mjs";

export default {
  name: "Update Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_bigin-update-contact",
  description: "Updates a contact. [See the documentation](https://www.bigin.com/developer/docs/apis/update-records.html)",
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    firstName: {
      label: "First Name",
      description: "The first name of the contact",
      type: "string",
      optional: true,
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the contact",
      type: "string",
      optional: true,
    },
    email: {
      label: "Email",
      description: "The email of the contact",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data: {
        data: [
          {
            First_Name: this.firstName,
            Last_Name: this.lastName,
            Email: this.email,
          },
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated contact with ID ${response?.data[0]?.details?.id}`);
    }

    return response;
  },
};
