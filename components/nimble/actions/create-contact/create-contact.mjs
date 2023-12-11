import app from "../../nimble.app.mjs";

export default {
  name: "Create Contact",
  version: "0.0.1",
  key: "nimble-create-contact",
  description: "Creates a contact. [See the documentation](https://nimble.readthedocs.io/en/latest/contacts/basic/create/)",
  type: "action",
  props: {
    app,
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
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
    },
    phone: {
      type: "string",
      label: "Phone number",
      description: "Phone number of the contact",
    },
  },
  async run({ $ }) {
    const response = await this.app.createContact({
      $,
      data: {
        record_type: "person",
        fields: {
          "first name": [
            {
              value: this.firstName,
            },
          ],
          "last name": [
            {
              value: this.lastName,
            },
          ],
          "email": [
            {
              value: this.email,
              modifier: "personal",
            },
          ],
          "phone": [
            {
              value: this.phone,
              modifier: "other",
            },
          ],
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID \`${response.id}\``);
    }

    return response;
  },
};
