import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-charges",
  name: "List Charges",
  description: "Return a list of charges. [See the documentation](https://developer.surecart.com/api-reference/charges/list)",
  version: "0.0.1",
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
      description: "Filter by checkout IDs. Use **List Checkouts** to find checkout IDs. Example: `[\"ch_abc123\"]`",
      optional: true,
    },
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs. Use **List Customers** to find customer IDs. Example: `[\"cus_abc123\"]`",
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
    limit: {
      propDefinition: [
        surecart,
        "limit",
      ],
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    page: {
      propDefinition: [
        surecart,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.listCharges({
      $,
      params: {
        "checkout_ids[]": this.checkoutIds,
        "customer_ids[]": this.customerIds,
        "external_charge_ids[]": this.externalChargeIds,
        "ids[]": this.ids,
        "limit": this.limit,
        "live_mode": this.liveMode,
        "page": this.page,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} charge(s)`);
    return response;
  },
};
