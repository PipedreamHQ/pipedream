import app from "../../nimble.app.mjs";

export default {
  name: "Create Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "nimble-create-contact",
  description: "Creates a contact. [See the documentation](https://nimble.readthedocs.io/en/latest/contacts/basic/create/)",
  type: "action",
  props: {
    app,
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
    email: {
      propDefinition: [
        app,
        "email",
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
