import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-update-deal",
  name: "Update a Deal",
  description:
    "Updates a CRPRO deal — move it to another stage, change its value or close it. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  props: {
    crpro,
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "The deal to update.",
    },
    title: {
      type: "string",
      label: "Title",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "Deal value in BRL.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      optional: true,
    },
    pipelineId: {
      propDefinition: [
        crpro,
        "pipelineId",
      ],
      description: "Only used to load the stage list below.",
    },
    stageId: {
      propDefinition: [
        crpro,
        "stageId",
        ({ pipelineId }) => ({
          pipelineId,
        }),
      ],
      description: "Set this to move the deal to another stage.",
    },
  },
  async run({ $ }) {
    const {
      crpro,
      dealId,
      title,
      value,
      status,
      stageId,
    } = this;

    const response = await crpro.updateDeal({
      $,
      dealId,
      data: {
        title,
        value: value !== undefined
          ? Number(value)
          : undefined,
        status,
        stage_id: stageId,
      },
    });

    $.export("$summary", `Successfully updated deal ${dealId}`);
    return response;
  },
};
