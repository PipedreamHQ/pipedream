import app from "../../liveswitch.app.mjs";

export default {
  key: "liveswitch-create-contact",
  name: "Create Contact",
  description: "Create a contact in LiveSwitch [See the documentation](https://developer.liveswitch.com/reference/post_v1-contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
    const response = await this.app.createContact({
      $,
      data: {
        phone: this.phone,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      },
    });

    $.export("$summary", `Successfully created Contact with ID: ${response.id}`);

    return response;
  },
};
