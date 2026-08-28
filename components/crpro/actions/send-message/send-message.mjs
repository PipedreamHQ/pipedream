import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-send-message",
  name: "Send a Message (Session)",
  description:
    "Sends a WhatsApp message through a number connected as a **session** (unofficial). Numbers on the official Cloud API are rejected here — use **Send a Message (Official API)** for those. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  props: {
    crpro,
    connectedPhone: {
      propDefinition: [
        crpro,
        "connectedPhone",
      ],
    },
    contactId: {
      propDefinition: [
        crpro,
        "contactId",
      ],
    },
    phone: {
      type: "string",
      label: "Recipient Phone",
      description:
        "Recipient phone in international format. Required unless **Contact** is set.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The kind of message to send.",
      options: [
        "text",
        "image",
        "audio",
        "video",
        "document",
      ],
      default: "text",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message body. Required when **Type** is `text`.",
      optional: true,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description:
        "Public URL of the file to send. Required when **Type** is not `text`.",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Caption shown with the media.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      crpro,
      connectedPhone,
      contactId,
      phone,
      type,
      message,
      mediaUrl,
      caption,
    } = this;

    if (!contactId && !phone) {
      throw new Error("Set either **Contact** or **Recipient Phone**.");
    }
    if (type === "text" && !message) {
      throw new Error("**Message** is required when **Type** is `text`.");
    }
    if (type !== "text" && !mediaUrl) {
      throw new Error("**Media URL** is required when **Type** is not `text`.");
    }

    const response = await crpro.sendMessage({
      $,
      data: {
        connected_phone: connectedPhone,
        contact_id: contactId,
        phone,
        type,
        message,
        media_url: mediaUrl,
        caption,
      },
    });

    $.export("$summary", `Successfully sent a ${type} message`);
    return response;
  },
};
