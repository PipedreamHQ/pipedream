import overloop from "../../overloop.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "overloop-update-deal",
  name: "Update Deal",
  description: "Updates a deal. [See the docs](https://apidoc.overloop.com/#update-a-deal)",
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
    },
    title: {
      propDefinition: [
        overloop,
        "title",
      ],
    },
    value: {
      propDefinition: [
        overloop,
        "value",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "deals",
        attributes: pickBy({
          stage_id: this.stageId,
          title: this.title,
          value: this.value,
        }),
      },
    };

    const { data: response } = await this.overloop.updateDeal(this.dealId, {
      data,
      $,
    });

    $.export("$summary", `Successfully created deal with ID ${response.id}.`);

    return response;
  },
};
