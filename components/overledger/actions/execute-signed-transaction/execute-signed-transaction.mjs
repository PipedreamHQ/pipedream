import overledger from "../../overledger.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "overledger-execute-signed-transaction",
  name: "Execute Signed Transaction",
  description: "Executes a signed transaction by sending it to a blockchain node via Overledger. [See the documentation](https://developers.quant.network/reference/executesignedrequest)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    overledger,
    requestId: {
      propDefinition: [
        overledger,
        "requestId",
      ],
    },
    signedTransaction: {
      propDefinition: [
        overledger,
        "signedTransaction",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.overledger.executeSignedTransaction({
      requestId: this.requestId,
      signedTransaction: this.signedTransaction,
    });

    $.export("$summary", `Successfully executed signed transaction with Request ID ${this.requestId}`);
    return response;
  },
};
