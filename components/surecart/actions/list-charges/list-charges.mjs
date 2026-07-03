import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-charges",
  name: "List Charges",
  description: "Return a list of charges. [See the documentation](https://developer.surecart.com/api-reference/charges/list)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    checkoutIds: {
      type: "string[]",
      label: "Checkout IDs",
      description: "Filter by checkout IDs. Use **List Checkouts** to find checkout IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs. Use **List Customers** to find customer IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    externalChargeIds: {
      type: "string[]",
      label: "External Charge IDs",
      description: "Filter by external charge IDs (e.g. from Stripe). Example: `[\"ch_stripe123\"]`",
      optional: true,
    },
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
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listCharges,
      args: {
        $,
        params: {
          "checkout_ids[]": this.checkoutIds,
          "customer_ids[]": this.customerIds,
          "external_charge_ids[]": this.externalChargeIds,
          "ids[]": this.ids,
          "live_mode": this.liveMode,
        },
      },
      max: this.maxResults,
    });

    const charges = [];
    for await (const charge of results) {
      charges.push(charge);
    }

    $.export("$summary", `Successfully retrieved ${charges.length} charge(s)`);
    return charges;
  },
};
