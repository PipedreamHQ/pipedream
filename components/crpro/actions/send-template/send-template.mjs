import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-send-template",
  name: "Send a Template Message",
  description:
    "Sends an approved WhatsApp template through the official Cloud API — the only way to open a conversation outside the 24-hour customer service window. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
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
    templateName: {
      type: "string",
      label: "Template Name",
      description: "Name of the template already approved by Meta.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Template language code, e.g. `pt_BR`.",
      default: "pt_BR",
    },
    components: {
      type: "object",
      label: "Components",
      description:
        "Template variables, in the shape the WhatsApp Cloud API expects.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      crpro,
      connectedPhone,
      contactId,
      phone,
      templateName,
      language,
      components,
    } = this;

    if (!contactId && !phone) {
      throw new Error("Set either **Contact** or **Recipient Phone**.");
    }

    const response = await crpro.sendTemplate({
      $,
      data: {
        connected_phone: connectedPhone,
        contact_id: contactId,
        phone,
        template_name: templateName,
        language,
        components,
      },
    });

    $.export("$summary", `Successfully sent template ${templateName}`);
    return response;
  },
};
