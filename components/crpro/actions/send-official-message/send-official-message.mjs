import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-send-official-message",
  name: "Send a Message (Official API)",
  description:
    "Sends a WhatsApp message through a number connected to the official Cloud API. Only works inside the 24-hour customer service window — outside it, use **Send a Template Message**. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
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
      description: "Required unless **Contact** is set.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
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
      description: "Required when **Type** is `text`.",
      optional: true,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "Required when **Type** is not `text`.",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      optional: true,
    },
    documentFilename: {
      type: "string",
      label: "Document Filename",
      description: "Filename shown to the recipient when **Type** is `document`.",
      optional: true,
    },
    previewUrl: {
      type: "boolean",
      label: "Link Preview",
      description: "Render a preview card for the first link in the message.",
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
      documentFilename,
      previewUrl,
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

    const response = await crpro.sendOfficialMessage({
      $,
      data: {
        connected_phone: connectedPhone,
        contact_id: contactId,
        phone,
        type,
        message,
        media_url: mediaUrl,
        caption,
        document_filename: documentFilename,
        preview_url: previewUrl,
      },
    });

    $.export("$summary", `Successfully sent a ${type} message`);
    return response;
  },
};
