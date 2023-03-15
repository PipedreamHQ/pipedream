import wise from "../../wise.app.mjs";

export default {
  name: "Create Quote",
  version: "0.0.1",
  key: "wise-create-quote",
  description: "Creates a quote. [See docs here](https://api-docs.wise.com/api-reference/quote#create-authenticated",
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
    targetAmount: {
      label: "Target Amount",
      description: "Amount in target currency to be received by the recipient. E.g. `100`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.wise.createQuote({
      $,
      profileId: this.profileId,
      data: {
        targetCurrency: this.targetCurrency,
        sourceCurrency: this.sourceCurrency,
        targetAmount: this.targetAmount,
        payOut: null,
        preferredPayIn: null,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created quote with id ${response.id}`);
    }

    return response;
  },
};
