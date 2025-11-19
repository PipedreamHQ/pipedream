import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-invitations-status",
  name: "Get Invitations Status",
  description: "Check the status of connection invitations for a LinkedIn profile. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Network/get_invitations_status)",
  version: "0.0.1",
  props: {
    app,
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
    },
    loginToken: {
      propDefinition: [
        app,
        "loginToken",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      linkedinUrl,
      loginToken,
      country,
    } = this;

    const response = await app.getInvitationsStatus({
      $,
      data: {
        linkedin_url: linkedinUrl,
        login_token: loginToken,
        country,
      },
    });

    $.export("$summary", "Successfully retrieved invitation status");

    return response;
  },
};
