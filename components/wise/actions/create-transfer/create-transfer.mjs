import wise from "../../wise.app.mjs";

export default {
  name: "Create Transfer",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "wise-create-transfer",
  description: "Creates a transfer. [See docs here](https://api-docs.wise.com/api-reference/transfer#create)",
  type: "action",
  props: {
    wise,
    quoteId: {
      label: "Quote ID",
      description: "The quote ID",
      type: "string",
    },
    targetAccountId: {
      propDefinition: [
        wise,
        "accountId",
      ],
    },
    reference: {
      label: "Reference",
      description: "Recipient will see this reference text in their bank statement.",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.wise.createTransfer({
      $,
      data: {
        targetAccount: this.targetAccountId,
        quoteUuid: this.quoteId,
        customerTransactionId: this.quoteId,
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
