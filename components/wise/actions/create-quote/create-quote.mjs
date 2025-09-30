import { ConfigurationError } from "@pipedream/platform";
import wise from "../../wise.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Quote",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "wise-create-quote",
  description: "Creates a quote. [See docs here](https://api-docs.wise.com/api-reference/quote#create-authenticated)",
  type: "action",
  props: {
    wise,
    profileId: {
      propDefinition: [
        wise,
        "profileId",
      ],
    },
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
    targetAmount: {
      label: "Target Amount",
      description: "Amount in target currency to be received by the recipient. E.g. `100.00`. Must specify either **Target Amount** or **Source Amount**",
      type: "string",
      optional: true,
    },
    sourceAmount: {
      label: "Source Amount",
      description: "Amount in source currency to be received by the recipient. E.g. `100.00`. Must specify either **Target Amount** or **Source Amount**",
      type: "string",
      optional: true,
    },
    payoutType: {
      label: "Payout Type",
      description: "Preferred payout method. Default value is `BANK_TRANSFER`. If you are funding the transfer from a Multi Currency Balance, you must set the `payOut` as `BALANCE` in order to get the correct pricing in the quote . By not doing so, it will default to `BANK_TRANSFER` and the fees will be inconsistent between quote and transfer.",
      type: "string",
      options: constants.PAYOUT_TYPES,
      default: constants.PAYOUT_TYPES[0],
      optional: true,
    },
  },
  async run({ $ }) {
    if ((this.targetAmount && this.sourceAmount) || (!this.targetAmount && !this.sourceAmount)) {
      throw ConfigurationError("Either sourceAmount or targetAmount is required, never both.");
    }

    const response = await this.wise.createQuote({
      $,
      profileId: this.profileId,
      data: {
        targetCurrency: this.targetCurrency,
        sourceCurrency: this.sourceCurrency,
        targetAmount: this.targetAmount,
        sourceAmount: this.sourceAmount,
        payOut: this.payoutType,
        preferredPayIn: null,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created quote with id ${response.id}`);
    }

    return response;
  },
};
