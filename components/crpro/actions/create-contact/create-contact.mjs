import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-create-contact",
  name: "Create a Contact",
  description:
    "Creates a contact in CRPRO, or updates it when the phone number already exists. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  props: {
    crpro,
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the contact.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description:
        "Contact phone in international format (e.g. `5511999999999`).",
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
      description: "Email address of the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to apply to the contact.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status to set on the contact.",
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
