import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-send-template",
  name: "Send a Template Message",
  description:
    "Sends an approved WhatsApp template through the official Cloud API — the only way to open a conversation outside the 24-hour customer service window. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
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
      description: "Phone of the person receiving the template, in international format, digits only — e.g. `5511999999999`. Required unless **Contact** is set.",
      optional: true,
    },
    templateName: {
      type: "string",
      label: "Template Name",
      description: "Name of a template already approved by Meta, e.g. `confirmacao_pedido`. Only templates approved for **Connected Number** can be sent, so set that first to load the list.",
      async options() {
        if (!this.connectedPhone) {
          return [];
        }
        const { templates } = await this.crpro.listTemplates({
          params: {
            connected_phone: this.connectedPhone,
          },
        });
        return (templates ?? []).map(({
          name, language,
        }) => ({
          label: language
            ? `${name} (${language})`
            : name,
          value: name,
        }));
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code of the approved template, e.g. `pt_BR` or `en_US`. It must match the language the template was approved under — Meta rejects the send otherwise.",
      default: "pt_BR",
    },
    components: {
      type: "object",
      label: "Components",
      description: "The template's variables, as a JSON **array** in the shape the WhatsApp Cloud API expects — e.g. `[{ \"type\": \"body\", \"parameters\": [{ \"type\": \"text\", \"text\": \"Ana\" }] }]`. Parameters are positional: their order must match the `{{1}}`, `{{2}}` placeholders in the approved template. CRPRO accepts `body` and `header` components only, and rejects anything else with a 400. Leave empty for a template with no variables.",
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

    const parsedComponents = typeof components === "string"
      ? JSON.parse(components)
      : components;

    if (parsedComponents !== undefined && !Array.isArray(parsedComponents)) {
      throw new Error("**Components** must be a JSON array, e.g. `[{ \"type\": \"body\", \"parameters\": [{ \"type\": \"text\", \"text\": \"Ana\" }] }]`.");
    }

    const response = await crpro.sendTemplate({
      $,
      data: {
        connected_phone: connectedPhone,
        contact_id: contactId,
        phone,
        template_name: templateName,
        language,
        components: parsedComponents,
      },
    });

    $.export("$summary", `Successfully sent template ${templateName}`);
    return response;
  },
};
