import brexApp from "../../brex.app.mjs";
import { formatMoney } from "../../common/utils.mjs";

export default {
  key: "brex-get-card",
  name: "Get Card",
  description: "Retrieves one card by ID, including its status, last four digits, and — for vendor cards — its spend limit and remaining available balance. Corporate cards return `spend_controls: null` because they draw on the cardholder's limit, which **Get User Limit** reports. [See the documentation](https://developer.brex.com/openapi/team_api/cards/getcardbyid)",
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
