import { ConfigurationError } from "@pipedream/platform";
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
      description: "LinkedIn profile URL. Eg. `https://www.linkedin.com/in/john-doe/`. Required unless **Identifier** is provided.",
      optional: true,
    },
    identifier: {
      propDefinition: [
        app,
        "identifier",
      ],
      description: "Unique identifier of the person to invite. Required unless **LinkedIn URL** is provided.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message to include with the connection request (max 300 chars).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.linkedinUrl && !this.identifier) {
      throw new ConfigurationError("Provide either a **LinkedIn URL** or an **Identifier** to invite.");
    }

    if (this.message && this.message.length > 300) {
      throw new ConfigurationError("Message must be less than 300 characters.");
    }

    const response = await this.app.connectToProfile({
      $,
      accountId: this.accountId,
      params: {
        profile_url: this.linkedinUrl,
        identifier: this.identifier,
        message: this.message,
      },
    });

    $.export("$summary", `Successfully sent connection invitation to ${this.linkedinUrl || this.identifier}`);
    return response;
  },
};
