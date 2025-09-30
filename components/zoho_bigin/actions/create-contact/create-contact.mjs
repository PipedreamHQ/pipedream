import app from "../../zoho_bigin.app.mjs";

export default {
  name: "Create Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "zoho_bigin-create-contact",
  description: "Creates a contact. [See the documentation](https://www.bigin.com/developer/docs/apis/insert-records.html)",
  type: "action",
  props: {
    app,
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
    },
    email: {
      label: "Email",
      description: "The email of the contact",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createContact({
      $,
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
      $.export("$summary", `Successfully created contact with ID ${response?.data[0]?.details?.id}`);
    }

    return response;
  },
};
