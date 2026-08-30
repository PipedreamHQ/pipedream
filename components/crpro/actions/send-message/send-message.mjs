import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-send-message",
  name: "Send a Message (Session)",
  description:
    "Sends a WhatsApp message through a number connected as a **session** (unofficial). Numbers on the official Cloud API are rejected here — use **Send a Message (Official API)** for those. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
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
      propDefinition: [
        crpro,
        "phone",
      ],
      label: "Recipient Phone",
      description: "Phone of the person receiving the message, in international format, digits only — e.g. `5511999999999`. Required unless **Contact** is set.",
      optional: true,
    },
    type: {
      propDefinition: [
        crpro,
        "messageType",
      ],
    },
    message: {
      propDefinition: [
        crpro,
        "message",
      ],
    },
    mediaUrl: {
      propDefinition: [
        crpro,
        "mediaUrl",
      ],
    },
    caption: {
      propDefinition: [
        crpro,
        "caption",
      ],
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
