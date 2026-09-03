// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import { formatMoney } from "../../common/utils.mjs";

export default {
  key: "brex-update-card-limit",
  name: "Update Card Limit",
  description: "Updates the spend limit on a vendor card (`limit_type: CARD`). Corporate cards draw on their cardholder's limit instead — use **Set Limit for User** for those. [See the documentation](https://developer.brex.com/openapi/team_api/cards/updatecard)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    cardId: {
      propDefinition: [
        brexApp,
        "cardId",
      ],
    },
    amount: {
      type: "integer",
      label: "Spend Limit Amount",
      description: "The new spend limit, in the currency's smallest denomination — `700` is $7.00 in USD.",
    },
    currency: {
      type: "string",
      label: "Spend Limit Currency",
      description: "The currency of the limit, in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format, e.g. `USD`. Defaults to `USD` when omitted.",
      optional: true,
    },
    spendDuration: {
      propDefinition: [
        brexApp,
        "spendDuration",
      ],
      description: "How often the limit refreshes. Omit to leave the card's current duration unchanged.",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "A free-text note explaining the new limit.",
      optional: true,
    },
    lockAfterDate: {
      type: "string",
      label: "Lock After Date",
      description: "Freeze the card automatically after this UTC date, in `yyyy-mm-dd` format.",
      optional: true,
    },
  },
  async run({ $ }) {
    const card = await this.brexApp.updateCard({
      $,
      cardId: this.cardId,
      data: {
        spend_controls: {
          spend_limit: {
            amount: this.amount,
            currency: this.currency ?? "USD",
          },
          spend_duration: this.spendDuration,
          reason: this.reason,
          lock_after_date: this.lockAfterDate,
        },
      },
    });

    const limit = formatMoney(card.spend_controls?.spend_limit);
    const duration = card.spend_controls?.spend_duration;

    $.export(
      "$summary",
      `Set limit on card "${card.card_name ?? card.id}" ••${card.last_four} to ${limit} (${duration})`,
    );

    return card;
  },
};
