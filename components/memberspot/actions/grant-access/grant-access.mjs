import app from "../../memberspot.app.mjs";

export default {
  name: "Grant Access",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "memberspot-grant-access",
  description: "Grant access to a user by email. [See the documentation](https://api.memberspot.de/api/#/users/UsersApiController_grantUserOfferByMail)",
  type: "action",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First name",
      description: "The user first name",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The user name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user email",
    },
    offerId: {
      propDefinition: [
        app,
        "offerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.grantAccess({
      $,
      data: {
        firstname: this.firstName,
        name: this.name,
        email: this.email,
        grantOffer: this.offerId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully granted access to user with ID \`${response.uid}\``);
    }

    return response;
  },
};
