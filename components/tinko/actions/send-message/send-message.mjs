import { ConfigurationError } from "@pipedream/platform";
import app from "../../tinko.app.mjs";
import {
  CAPTION_TYPES,
  MEDIA_TYPES,
  MESSAGE_TYPES,
} from "../../common/constants.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "tinko-send-message",
  name: "Send Message",
  description: "Send a text, media, contact card or WhatsApp template message to a contact from a Tinko channel."
    + " An unknown phone number creates a new contact."
    + " On official WhatsApp channels, only templates can be sent outside the 24 hour customer service window."
    + " Use **List Channels** to find the channel and **List Templates** to find approved templates."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/messages/#enviar-mensagem)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
      description: "The channel (connected number or account) that sends the message, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Channels** to find channel IDs (the `id` field).",
    },
    phone: {
      type: "string",
      label: "Recipient",
      description: "Phone number with country code, the ID of an existing contact, or a WhatsApp group ID, e.g. `5511999999999`. An unknown phone number creates a new contact. Use **Find Contact** to look up contact IDs.",
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The kind of message to send. One of `text`, `image`, `video`, `audio`, `document`, `sticker`, `vcard` or `template`, e.g. `text`. Each type uses different fields below.",
      options: MESSAGE_TYPES,
      default: "text",
    },
    content: {
      type: "string",
      label: "Text",
      description: "The text of the message, up to 4096 characters, e.g. `Hello, your order is on its way`. Required when **Message Type** is `text`.",
      optional: true,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "Public URL of the file to send, e.g. `https://example.com/invoice.pdf`. Required when **Message Type** is `image`, `video`, `audio`, `document` or `sticker`.",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Text shown together with the file, up to 1024 characters, e.g. `Here is your invoice`. Used when **Message Type** is `image`, `video` or `document`.",
      optional: true,
    },
    cardName: {
      type: "string",
      label: "Card Name",
      description: "Name shown on the contact card, e.g. `Nathan Smith`. Required when **Message Type** is `vcard`.",
      optional: true,
    },
    cardPhone: {
      type: "string",
      label: "Card Phone Number",
      description: "Phone number shared on the contact card, with country code, e.g. `5511988887777`. Required when **Message Type** is `vcard`.",
      optional: true,
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
        (c) => ({
          channelId: c.channelId,
        }),
      ],
      description: "The approved WhatsApp template to send, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Templates work only on official WhatsApp channels. Required when **Message Type** is `template`. Use **List Templates** with the same channel to find template IDs (the `id` field).",
      optional: true,
    },
    templateComponents: {
      type: "string",
      label: "Template Components",
      description: "JSON array with the values of the template variables. Each item has `type` (`header`, `body` or `button`) and `parameters` (each with `type` and `text`, or `type` and `path` for media). Buttons also need `sub_type` (`url` or `quick_reply`) and `index`. Used when **Message Type** is `template`, e.g. `[{\"type\":\"body\",\"parameters\":[{\"type\":\"text\",\"text\":\"Nathan\"}]}]`.",
      optional: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The Tinko user registered as the sender of the message, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Users** to find user IDs (the `id` field).",
      optional: true,
    },
  },
  async run({ $ }) {
    const type = this.messageType || "text";
    const data = {
      phone: this.phone,
      channel: this.channelId,
      type,
      attendant: this.userId,
    };

    if (type === "text") {
      if (!this.content) {
        throw new ConfigurationError("**Text** is required when **Message Type** is `text`.");
      }
      data.content = this.content;
    } else if (MEDIA_TYPES.includes(type)) {
      if (!this.mediaUrl) {
        throw new ConfigurationError(`**Media URL** is required when **Message Type** is \`${type}\`.`);
      }
      data.path = this.mediaUrl;
      if (CAPTION_TYPES.includes(type)) {
        data.caption = this.caption;
      }
    } else if (type === "vcard") {
      if (!this.cardName || !this.cardPhone) {
        throw new ConfigurationError("**Card Name** and **Card Phone Number** are required when **Message Type** is `vcard`.");
      }
      data.name = this.cardName;
      data.contact = this.cardPhone;
    } else if (type === "template") {
      if (!this.templateId) {
        throw new ConfigurationError("**Template** is required when **Message Type** is `template`.");
      }
      const components = parseJson(this.templateComponents, "Template Components");
      if (components !== undefined && !Array.isArray(components)) {
        throw new ConfigurationError("**Template Components** must be a JSON array.");
      }
      data.template = this.templateId;
      data.components = components?.length
        ? components
        : undefined;
    }

    const response = await this.app.sendMessage({
      $,
      data,
    });

    const recipient = response.data?.contact?.name || response.data?.contact?.phone || this.phone;
    $.export("$summary", `Successfully sent a ${type} message to ${recipient}`);
    return response.data;
  },
};
