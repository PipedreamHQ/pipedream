import proabono from "../../proabono.app.mjs";

export default {
  key: "proabono-create-subscription",
  name: "Create Subscription",
  description: "Initializes a new subscription for a customer in the ProAbono system. [See the documentation](https://docs.proabono.com/api/#create-a-subscription)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    proabono,
    offerId: {
      propDefinition: [
        proabono,
        "offerId",
      ],
    },
    customerId: {
      propDefinition: [
        proabono,
        "customerId",
      ],
    },
    buyerId: {
      propDefinition: [
        proabono,
        "customerId",
      ],
      label: "Buyer ID",
      description: "ID Reference of the Customer who buys",
      optional: true,
    },
    metadata: {
      propDefinition: [
        proabono,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.proabono.createSubscription({
      $,
      data: {
        ReferenceOffer: this.offerId,
        ReferenceCustomer: this.customerId,
        ReferenceCustomerBuyer: this.buyerId,
        Metadata: this.metadata,
      },
    });

    $.export("$summary", `Created subscription for customer ID ${this.customerId}`);

    return response;
  },
};
