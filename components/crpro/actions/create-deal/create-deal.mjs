import crpro from "../../crpro.app.mjs";
import { parseDealValue } from "../../common/utils.mjs";

export default {
  key: "crpro-create-deal",
  name: "Create a Deal",
  description:
    "Creates a deal in a CRPRO pipeline, resolving or creating the contact from a phone number. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crpro,
    title: {
      type: "string",
      label: "Title",
      description: "Name of the deal as it appears on the board, e.g. `Plano Pro — Ana Souza`.",
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
      propDefinition: [
        crpro,
        "recipientPhone",
      ],
      label: "Contact Phone",
    },
    value: {
      type: "string",
      label: "Value",
      description: "Deal amount in BRL as a plain number, using `.` as the decimal separator and no currency symbol or thousands separator — e.g. `1499.90`. Leave empty for a deal with no amount.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact, e.g. `ana@example.com`. Only used when the contact is created by this action.",
      optional: true,
    },
    seller: {
      type: "string",
      label: "Seller",
      description: "Name of the person who owns the deal, e.g. `Carlos`. Free text — it is stored as written, not matched against CRPRO users.",
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
      description: "Your own identifier for this deal, e.g. an order ID such as `pedido-10432`. Max 160 characters. CRPRO stores it as `external_ref` and it can be looked up later through `GET /deals?external_ref=`, which makes it the key for keeping a deal in sync with a record in your own system.",
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
        value: parseDealValue(value),
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
