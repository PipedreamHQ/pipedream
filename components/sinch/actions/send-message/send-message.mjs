import sinch from "../../sinch.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "sinch-send-message",
  name: "Send Message",
  description: "Send a message to a contact. [See the documentation](https://developers.sinch.com/docs/conversation/api-reference/conversation/tag/Messages/#tag/Messages/operation/Messages_SendMessage)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sinch,
    appId: {
      propDefinition: [
        sinch,
        "appId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send",
    },
    contactId: {
      propDefinition: [
        sinch,
        "contactId",
      ],
      description: "The ID of the recipient. Overrides channel and identity",
      optional: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel to send the message to",
      options: constants.CHANNELS,
      optional: true,
    },
    identity: {
      type: "string",
      label: "Identity",
      description: "The channel identity. This will differ from channel to channel. For example, a phone number for SMS, WhatsApp, and Viber Business.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.contactId && !this.identity) {
      throw new ConfigurationError("You must provide either a contact ID or an identity.");
    }

    if (this.identity && !this.channel) {
      throw new ConfigurationError("You must provide a channel when providing an identity.");
    }

    const response = await this.sinch.sendMessage({
      $,
      data: {
        app_id: this.appId,
        recipient: this.contactId
          ? {
            contact_id: this.contactId,
          }
          : {
            identified_by: {
              channel_identities: [
                {
                  channel: this.channel,
                  identity: this.identity,
                },
              ],
            },
          },
        message: {
          text_message: {
            text: this.message,
          },
        },
      },
    });
    $.export("$summary", "Successfully sent message");
    return response;
  },
};
