import shift4 from "../../shift4.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shift4-create-charge",
  name: "Create Charge",
  description: "Creates a new charge object. [See the documentation](https://dev.shift4.com/docs/api#charges-create-a-new-charge)",
  version: "0.0.1",
  type: "action",
  props: {
    shift4,
    amount: shift4.propDefinitions.amount,
    currency: shift4.propDefinitions.currency,
    type: shift4.propDefinitions.type,
    description: shift4.propDefinitions.description,
    customerId: shift4.propDefinitions.customerId,
    card: shift4.propDefinitions.card,
    paymentMethod: shift4.propDefinitions.paymentMethod,
    flow: shift4.propDefinitions.flow,
    captured: shift4.propDefinitions.captured,
    shipping: shift4.propDefinitions.shipping,
    billing: shift4.propDefinitions.billing,
    threeDSecure: shift4.propDefinitions.threeDSecure,
    merchantAccountId: shift4.propDefinitions.merchantAccountId,
    metadata: shift4.propDefinitions.metadata,
  },
  async run({ $ }) {
    const response = await this.shift4.createCharge({
      amount: this.amount,
      currency: this.currency,
      type: this.type,
      description: this.description,
      customerId: this.customerId,
      card: this.card,
      paymentMethod: this.paymentMethod,
      flow: this.flow,
      captured: this.captured,
      shipping: this.shipping,
      billing: this.billing,
      threeDSecure: this.threeDSecure,
      merchantAccountId: this.merchantAccountId,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created charge with ID ${response.id}`);
    return response;
  },
};
