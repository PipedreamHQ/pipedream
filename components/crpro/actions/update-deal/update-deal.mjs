import crpro from "../../crpro.app.mjs";
import { parseDealValue } from "../../common/utils.mjs";

export default {
  key: "crpro-update-deal",
  name: "Update a Deal",
  description:
    "Updates a CRPRO deal — move it to another stage, change its value or close it. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crpro,
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "UUID of the deal to update, e.g. `9f1c2f7e-4b2a-4d8e-9c31-2f0a5b7d8e10`. Returned as `id` by **Create a Deal** and by `GET /deals`, which also accepts `?external_ref=` to find a deal by your own identifier.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "New name for the deal, e.g. `Plano Pro — Ana Souza`. Leave empty to keep the current one.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "New deal amount in BRL as a plain number, using `.` as the decimal separator and no currency symbol — e.g. `1499.90`. Leave empty to keep the current amount.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Lifecycle state of the deal, as free-form text. CRPRO creates every deal as `open`; won and lost are modelled by the **Stage** the deal sits in, not by this field, so moving the deal is normally what you want instead of writing here.",
      optional: true,
    },
    pipelineId: {
      propDefinition: [
        crpro,
        "pipelineId",
      ],
      description: "The pipeline whose stages **Stage** should offer. This field only loads that list — it does not move the deal on its own.",
    },
    stageId: {
      propDefinition: [
        crpro,
        "stageId",
        ({ pipelineId }) => ({
          pipelineId,
        }),
      ],
      description: "Set this to move the deal to another stage. Pick a **Pipeline** first to load its stages.",
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
        value: parseDealValue(value),
        status,
        stage_id: stageId,
      },
    });

    $.export("$summary", `Successfully updated deal ${dealId}`);
    return response;
  },
};
