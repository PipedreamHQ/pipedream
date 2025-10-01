import poof from "../../poof.app.mjs";

export default {
  key: "poof-send-transaction",
  name: "Send Transaction",
  description: "Sends a transaction in Poof. [See the documentation](https://docs.poof.io/reference/sendtransaction)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    poof,
    amount: {
      type: "string",
      label: "Amount",
      description: "The transaction amount",
    },
    crypto: {
      type: "string",
      label: "Crypto",
      description: "The type of cryptocurrency. Example: `bitcoin`",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address to send the transaction to",
    },
  },
  async run({ $ }) {
    const response = await this.poof.sendTransaction({
      data: {
        amount: +this.amount,
        crypto: this.crypto,
        address: this.address,
      },
      $,
    });

    if (response?.message !== "invalid") {
      $.export("$summary", "Successfully sent transaction.");
    }

    return response;
  },
};
