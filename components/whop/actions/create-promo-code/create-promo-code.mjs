import {
  BASE_CURRENCY_OPTIONS, PROMO_TYPE_OPTIONS,
} from "../../common/contants.mjs";
import { parseString } from "../../common/utils.mjs";
import whop from "../../whop.app.mjs";

export default {
  key: "whop-create-promo-code",
  name: "Create Promo Code",
  description: "Creates a new promo code with the given parameters in Whop. [See the documentation](https://dev.whop.com/api-reference/v2/promo-codes/create-a-promo-code)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whop,
    amountOff: {
      type: "integer",
      label: "Amount Off",
      description: "The amount off (percentage or flat amount) for the Promo Code.",
    },
    baseCurrency: {
      type: "string",
      label: "Base Currency",
      description: "The monetary currency of the Promo Code.",
      options: BASE_CURRENCY_OPTIONS,
    },
    code: {
      type: "string",
      label: "Code",
      description: "The specific code used to apply the Promo Code at checkout.",
    },
    expirationDatetime: {
      type: "integer",
      label: "Expiration Datetime",
      description: "The date/time of when the Promo Code expires.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        whop,
        "metadata",
      ],
      optional: true,
    },
    newUsersOnly: {
      type: "boolean",
      label: "New Users Only",
      description: "Restricts Promo Code use to users who haven't purchased from the company before.",
      optional: true,
    },
    numberOfIntervals: {
      type: "integer",
      label: "Number Of Intervals",
      description: "The number of billing cycles the Promo Code is applied for. By default, it is applied forever (0).",
      optional: true,
    },
    planId: {
      propDefinition: [
        whop,
        "planId",
      ],
      type: "string[]",
      label: "Plan Ids",
      description: "The IDs of plans associated with the Promo Code.",
      optional: true,
    },
    promoType: {
      type: "string",
      label: "Promo Type",
      description: "Whether the Promo Code is a percentage or flat amount off.",
      options: PROMO_TYPE_OPTIONS,
    },
    stock: {
      type: "integer",
      label: "Stock",
      description: "The number of total uses remaining for the Promo Code.",
    },
    unlimitedStock: {
      type: "boolean",
      label: "Unlimited Stock",
      description: "Whether or not the Promo Code has unlimited uses.",
    },
  },
  async run({ $ }) {
    const response = await this.whop.createPromoCode({
      data: {
        amount_off: this.amountOff,
        base_currency: this.baseCurrency,
        code: this.code,
        expiration_datetime: this.expirationDatetime,
        metadata: this.metadata,
        new_users_only: this.newUsersOnly,
        number_of_intervals: this.numberOfIntervals,
        plan_ids: parseString(this.planId),
        promo_type: this.promoType,
        stock: this.stock,
        unlimited_stock: this.unlimitedStock,
      },
    });

    $.export("$summary", `Successfully created promo code with ID: ${response.id}`);
    return response;
  },
};
