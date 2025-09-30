import app from "../../nimble.app.mjs";

export default {
  name: "Update Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "nimble-update-contact",
  description: "Updates a contact. [See the documentation](https://nimble.readthedocs.io/en/latest/contacts/basic/update/)",
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
    const fields = {};

    if (this.firstName) {
      fields["first name"] = [
        {
          value: this.firstName,
        },
      ];
    }

    if (this.lastName) {
      fields["last name"] = [
        {
          value: this.lastName,
        },
      ];
    }

    if (this.email) {
      fields["email"] = [
        {
          value: this.email,
          modifier: "personal",
        },
      ];
    }

    if (this.phone) {
      fields["phone"] = [
        {
          value: this.phone,
          modifier: "other",
        },
      ];
    }

    const response = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data: {
        record_type: "person",
        fields: {
          ...fields,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated contact with ID \`${response.id}\``);
    }

    return response;
  },
};
