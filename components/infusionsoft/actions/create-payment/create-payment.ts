import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Payment",
  description: "Create or add a payment record [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/createPaymentOnOrderUsingPOST)",
  key: "infusionsoft-create-payment",
  version: "0.0.1",
  type: "action",
  props: {
    infusionsoft,
    orderId: {
      propDefinition: [
        infusionsoft,
        "orderId"
      ]
    }
  },
  async run({ $ }): Promise<object> {
    const data: object = await this.infusionsoft.createPayment({
      orderId: this.orderId
    });

    $.export("$summary", "Created Payment successfully");

    return data;
  },
});
