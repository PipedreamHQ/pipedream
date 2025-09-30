import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-move-deal",
  name: "Move Deal",
  description: "Moves a deal. [See the docs](https://apidoc.overloop.com/#update-a-deal)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    dealId: {
      propDefinition: [
        overloop,
        "dealId",
      ],
    },
    stageId: {
      propDefinition: [
        overloop,
        "stageId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "deals",
        attributes: {
          stage_id: this.stageId,
        },
      },
    };

    const { data: response } = await this.overloop.updateDeal(this.dealId, {
      data,
      $,
    });

    $.export("$summary", `Successfully moved deal with ID ${this.dealId}.`);

    return response;
  },
};
