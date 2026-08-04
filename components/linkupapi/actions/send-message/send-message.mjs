import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-send-message",
  name: "Send Message",
  description: "Send a message to a LinkedIn profile. Make sure you are already connected to the recipient. [See the documentation](https://docs.linkupapi.com/api-reference/v2/messages/send)",
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
      description: "LinkedIn profile URL of the recipient. Eg. `https://www.linkedin.com/in/john-doe/`.",
    },
    messageText: {
      propDefinition: [
        app,
        "messageText",
      ],
    },
    mediaLink: {
      type: "string",
      label: "Media Link",
      description: "URL of a media attachment (image, document, etc.) to include with the message.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.sendMessage({
      $,
      accountId: this.accountId,
      params: {
        profile_url: this.linkedinUrl,
        message_text: this.messageText,
        media_link: this.mediaLink,
      },
    });

    $.export("$summary", `Successfully sent message to ${this.linkedinUrl}`);
    return response;
  },
};
