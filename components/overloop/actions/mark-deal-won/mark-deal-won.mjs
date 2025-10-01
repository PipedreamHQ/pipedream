import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-mark-deal-won",
  name: "Mark Deal as Won",
  description: "Marks a deal as won. [See the docs](https://apidoc.overloop.com/#mark-as-won)",
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
  },
  async run({ $ }) {
    const { data: response } = await this.overloop.markDealWon(this.dealId, {
      $,
    });

    $.export("$summary", `Successfully marked deal with ID ${this.dealId} as won.`);

    return response;
  },
};
