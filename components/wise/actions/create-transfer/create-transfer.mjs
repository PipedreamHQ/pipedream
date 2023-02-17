import wise from "../../wise.app.mjs";

export default {
  name: "Create Transfer",
  version: "0.0.1",
  key: "wise-create-transfer",
  description: "Creates a transfer. [See docs here](https://api-docs.wise.com/api-reference/transfer#create)",
  type: "action",
  props: {
    wise,
    sourceCurrency: {
      label: "Source Currency",
      description: "The source currency",
      propDefinition: [
        wise,
        "currency",
      ],
    },
    targetCurrency: {
      label: "Target Currency",
      description: "The target currency",
      propDefinition: [
        wise,
        "currency",
        (c) => ({
          sourceCurrency: c.sourceCurrency,
        }),
      ],
    },
    profileId: {
      propDefinition: [
        wise,
        "profileId",
      ],
    },
    targetAccountId: {
      propDefinition: [
        wise,
        "accountId",
      ],
    },
    amount: {
      label: "Amount",
      description: "Amount in target currency to be received by the recipient. E.g. `100`",
      type: "string",
    },
    reference: {
      label: "Reference",
      description: "Recipient will see this reference text in their bank statement.",
      type: "string",
    },
  },
  async run({ $ }) {
    const quote = await this.wise.createQuote({
      $,
      profileId: this.profileId,
      data: {
        targetCurrency: this.targetCurrency,
        sourceCurrency: this.sourceCurrency,
        targetAmount: null,
        payOut: null,
        preferredPayIn: null,
      },
    });

    const response = await this.wise.createTransfer({
      $,
      data: {
        targetAccount: this.targetAccountId,
        quoteUuid: quote.id,
        customerTransactionId: quote.id,
        details: {
          reference: this.reference,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created transfer with id ${response.id}`);
    }

    return response;
  },
};
