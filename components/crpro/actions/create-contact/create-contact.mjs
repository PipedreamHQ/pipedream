import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-create-contact",
  name: "Create a Contact",
  description:
    "Creates a contact in CRPRO, or updates it when the phone number already exists. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crpro,
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the contact, e.g. `Ana Souza`.",
    },
    phone: {
      propDefinition: [
        crpro,
        "phone",
      ],
    },
    connectedPhone: {
      propDefinition: [
        crpro,
        "connectedPhone",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact, e.g. `ana@example.com`.",
      optional: true,
    },
    tags: {
      propDefinition: [
        crpro,
        "tags",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Conversation state of the contact — `open` while the conversation is being handled, `closed` once it is resolved. This is the inbox state, not a CRM lifecycle stage; use **Apply Tags to a Contact** or a deal for that. Defaults to `open` when left empty.",
      options: [
        "open",
        "closed",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      crpro,
      name,
      phone,
      connectedPhone,
      email,
      tags,
      status,
    } = this;

    const response = await crpro.createContact({
      $,
      data: {
        name,
        phone,
        connected_phone: connectedPhone,
        email,
        tags,
        status,
      },
    });

    $.export("$summary", `Successfully saved contact ${name}`);
    return response;
  },
};
