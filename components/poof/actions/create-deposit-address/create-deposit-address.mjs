import poof from "../../poof.app.mjs";

export default {
  key: "poof-create-deposit-address",
  name: "Create Deposit Address",
  description: "Creates a new deposit address in Poof. [See the documentation](https://docs.poof.io/reference/create_address)",
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
  },
  async run({ $ }) {
    const response = await this.poof.createDepositAddress({
      data: {
        amount: +this.amount,
        crypto: this.crypto,
      },
      $,
    });

    if (response?.address) {
      $.export("$summary", `Successfully created deposit address ${response.address}.`);
    }

    return response;
  },
};
