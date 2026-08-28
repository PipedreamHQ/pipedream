import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-create-deal",
  name: "Create a Deal",
  description:
    "Creates a deal in a CRPRO pipeline, resolving or creating the contact from a phone number. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  props: {
    crpro,
    title: {
      type: "string",
      label: "Title",
      description: "Name of the deal.",
    },
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
      label: "Contact Phone",
      description:
        "Required unless **Contact** is set. A new contact is created when the phone is unknown.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "Deal value in BRL, e.g. `1499.90`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
    },
    seller: {
      type: "string",
      label: "Seller",
      description: "Who owns the deal.",
      optional: true,
    },
    pipelineId: {
      propDefinition: [
        crpro,
        "pipelineId",
      ],
    },
    stageId: {
      propDefinition: [
        crpro,
        "stageId",
        ({ pipelineId }) => ({
          pipelineId,
        }),
      ],
    },
    externalRef: {
      type: "string",
      label: "External Reference",
      description:
        "Your own identifier for this deal, searchable later through **List Deals**. Max 160 characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      crpro,
      title,
      connectedPhone,
      contactId,
      phone,
      value,
      email,
      seller,
      pipelineId,
      stageId,
      externalRef,
    } = this;

    if (!contactId && !phone) {
      throw new Error("Set either **Contact** or **Contact Phone**.");
    }

    const response = await crpro.createDeal({
      $,
      data: {
        title,
        connected_phone: connectedPhone,
        contact_id: contactId,
        phone,
        value: value !== undefined
          ? Number(value)
          : undefined,
        email,
        seller,
        pipeline_id: pipelineId,
        stage_id: stageId,
        external_ref: externalRef,
      },
    });

    $.export("$summary", `Successfully created deal ${title}`);
    return response;
  },
};
