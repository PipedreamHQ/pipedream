import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-coupons",
  name: "List Coupons",
  description: "Return a list of coupons. [See the documentation](https://developer.surecart.com/api-reference/coupons/list)",
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
      fn: this.surecart.listCoupons,
      args: {
        $,
        params: {
          "ids[]": this.ids,
        },
      },
      max: this.maxResults,
    });

    const coupons = [];
    for await (const coupon of results) {
      coupons.push(coupon);
    }

    $.export("$summary", `Successfully retrieved ${coupons.length} coupon(s)`);
    return coupons;
  },
};
