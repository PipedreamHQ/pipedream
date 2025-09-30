import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-mark-deal-lost",
  name: "Mark Deal as Lost",
  description: "Marks a deal as lost. [See the docs](https://apidoc.overloop.com/#mark-as-lost)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    lossReason: {
      type: "string",
      label: "Loss Reason",
      description: "Reason the deal was lost",
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "deals",
        attributes: {
          loss_reason: this.lossReason,
        },
      },
    };

    const { data: response } = await this.overloop.markDealLost(this.dealId, {
      data,
      $,
    });

    $.export("$summary", `Successfully marked deal with ID ${this.dealId} as lost.`);

    return response;
  },
};
