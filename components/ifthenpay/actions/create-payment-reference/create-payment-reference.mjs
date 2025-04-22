import ifthenpay from "../../ifthenpay.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ifthenpay-create-payment-reference",
  name: "Create Payment Reference",
  description: "Generates a Multibanco or MB WAY payment reference with a specified amount, entity code, and deadline. [See the documentation](https://ifthenpay.com/docs/en/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ifthenpay,
    paymentMethod: {
      propDefinition: [
        ifthenpay,
        "paymentMethod",
      ],
    },
    amount: {
      propDefinition: [
        ifthenpay,
        "amount",
      ],
    },
    customerDetails: {
      propDefinition: [
        ifthenpay,
        "customerDetails",
      ],
    },
    expirationDate: {
      propDefinition: [
        ifthenpay,
        "expirationDate",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        ifthenpay,
        "description",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ifthenpay.generatePaymentReference({
      paymentMethod: this.paymentMethod,
      amount: this.amount,
      customerDetails: this.customerDetails,
      expirationDate: this.expirationDate,
      description: this.description,
    });

    $.export("$summary", `Successfully created payment reference with Order ID: ${response.OrderId}`);
    return response;
  },
};
