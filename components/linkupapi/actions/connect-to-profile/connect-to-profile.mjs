import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-connect-to-profile",
  name: "Connect to Profile",
  description: "Send a connection request to a LinkedIn profile. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Network/connect)",
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
    message: {
      type: "string",
      label: "Message",
      description: "Optional custom message to include with connection request",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
    idempotentHint: false,
  },
  async run({ $ }) {
    const {
      app,
      linkedinUrl,
      loginToken,
      message,
      country,
    } = this;

    const response = await app.connectToProfile({
      $,
      data: {
        linkedin_url: linkedinUrl,
        login_token: loginToken,
        message_text: message,
        country,
      },
    });

    $.export("$summary", "Successfully sent connection request");

    return response;
  },
};
