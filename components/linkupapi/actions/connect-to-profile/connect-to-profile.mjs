import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-connect-to-profile",
  name: "Connect To Profile",
  description: "Send a connection invitation to a LinkedIn profile. [See the documentation](https://docs.linkupapi.com/api-reference/v2/network/invite)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      description: "LinkedIn profile URL. Eg. `https://www.linkedin.com/in/john-doe/`.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Optional note to include with the connection request (max 300 chars).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.connectToProfile({
      $,
      accountId: this.accountId,
      params: {
        profile_url: this.linkedinUrl,
        message: this.message,
      },
    });

    $.export("$summary", `Successfully sent connection invitation to ${this.linkedinUrl}`);
    return response;
  },
};
