// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";

const MINOR_UNITS_PER_UNIT = 100;

function formatMoney(money) {
  if (!money) {
    return null;
  }
  // Brex returns amounts in the currency's smallest denomination (cents for USD).
  return `${(money.amount / MINOR_UNITS_PER_UNIT).toFixed(2)} ${money.currency ?? "USD"}`;
}

export default {
  key: "brex-get-card",
  name: "Get Card",
  description: "Retrieve one Brex card by its ID, including status, last four digits, "
    + "expiration date, billing address, and — for vendor cards — the spend limit and the "
    + "remaining available balance."
    + " Use this when the question is about a single card you already have an ID for;"
    + " use **List Cards** to find cards by cardholder, name, status, or last four digits."
    + " Vendor cards (`limit_type: CARD`) carry their own limit under `spend_controls`."
    + " Corporate cards (`limit_type: USER`) return `spend_controls: null` because they draw"
    + " on the cardholder's monthly limit instead, which is set with **Set Limit for User**."
    + " All money amounts are in the currency's smallest denomination, so `700` is $7.00 in USD."
    + " [See the documentation](https://developer.brex.com/openapi/team_api/cards/getcardbyid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const card = await this.brexApp.getCard({
      $,
      cardId: this.cardId,
    });

    const limit = formatMoney(card.spend_controls?.spend_limit);
    const available = formatMoney(card.spend_controls?.spend_available);
    const limitDetail = limit
      ? `${available ?? "unknown"} of ${limit} available`
      : "no card-level limit (draws on the cardholder's user limit)";

    $.export(
      "$summary",
      `Card "${card.card_name}" ••${card.last_four} — ${card.status}, ${limitDetail}`,
    );

    return card;
  },
};
