import app from "../../memberspot.app.mjs";

export default {
  name: "Delete Access",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "memberspot-delete-access",
  description: "Delete access of a user by email. [See the documentation](https://api.memberspot.de/api/#/users/UsersApiController_setOfferState)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The user email to be deleted",
    },
    offerId: {
      propDefinition: [
        app,
        "offerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteAccess({
      $,
      data: {
        email: this.email,
        offerId: this.offerId,
        active: false,
      },
    });

    if (response) {
      $.export("$summary", `Successfully deleted user with email \`${response.email}\``);
    }

    return response;
  },
};
