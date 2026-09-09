import brexApp from "../../brex.app.mjs";
import { formatMoney } from "../../common/utils.mjs";

export default {
  key: "brex-update-card-limit",
  name: "Update Card Limit",
  description: "Updates the spend limit on a vendor card (`limit_type: CARD`). This sends a complete `spend_controls` object, so treat it as a replacement: supply every spend control you want the card to keep, because Brex does not document whether omitted fields are preserved or cleared. Corporate cards draw on their cardholder's limit instead — use **Set Limit for User** for those. [See the documentation](https://developer.brex.com/openapi/team_api/cards/updatecard)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
      description: "The currency of the limit, in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format, e.g. `USD`. Defaults to `USD` when omitted, so set this explicitly for a card denominated in any other currency.",
      optional: true,
    },
    spendDuration: {
      propDefinition: [
        brexApp,
        "spendDuration",
      ],
      description: "How often the limit refreshes: `MONTHLY`, `QUARTERLY`, or `YEARLY` to refresh on that cadence, or `ONE_TIME` for a limit that never refreshes. Sent on every update, so set it to the cadence the card should have from now on — use **Get Card** to read the card's current duration first if you only mean to change the amount.",
      optional: false,
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "A free-text note explaining the new limit. Sent on every update, so re-supply the card's existing note if you want to keep it — use **Get Card** to read it first.",
      optional: true,
    },
    lockAfterDate: {
      type: "string",
      label: "Lock After Date",
      description: "Freeze the card automatically after this UTC date, in `yyyy-mm-dd` format. Sent on every update, so re-supply the card's existing lock date if you want to keep it — use **Get Card** to read it first.",
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
