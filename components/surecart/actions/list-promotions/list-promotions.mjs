import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-promotions",
  name: "List Promotions",
  description: "Return a list of promotions. [See the documentation](https://developer.surecart.com/api-reference/promotions/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listPromotions,
      args: {
        $,
        params: {
          "ids[]": this.ids,
        },
      },
      max: this.maxResults,
    });

    const promotions = [];
    for await (const promotion of results) {
      promotions.push(promotion);
    }

    $.export("$summary", `Successfully retrieved ${promotions.length} promotion(s)`);
    return promotions;
  },
};
