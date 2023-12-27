import digitalriver from "../../digitalriver.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "digitalriver-cancel-order",
  name: "Cancel Order",
  description: "Cancels an existing order in Digital River. [See the documentation](https://docs.digitalriver.com/digital-river-api-reference/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    digitalriver,
    orderId: {
      propDefinition: [
        digitalriver,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.digitalriver.cancelOrder({
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully cancelled order with ID ${this.orderId}`);
    return response;
  },
};
