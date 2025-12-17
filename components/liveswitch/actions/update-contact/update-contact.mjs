import app from "../../liveswitch.app.mjs";

export default {
  key: "liveswitch-update-contact",
  name: "Update Contact",
  description: "Update a contact in LiveSwitch [See the documentation](https://developer.liveswitch.com/reference/post_v1-contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
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
  },

  async run({ $ }) {
    const response = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data: {
        phone: this.phone,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      },
    });

    $.export("$summary", `Successfully updated Contact with ID: ${this.contactId}`);

    return response;
  },
};
