import brexApp from "../../brex.app.mjs";

export default {
  key: "brex-cancel-card",
  name: "Cancel Card",
  description: "Cancels (terminates) a card permanently. This cannot be undone — use **Freeze Card** to block a card temporarily instead. [See the documentation](https://developer.brex.com/openapi/team_api/cards/terminatecard)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    reason: {
      propDefinition: [
        brexApp,
        "cardActionReason",
      ],
      description: "Why the card is being cancelled. Brex requires a reason and records it against the card.",
    },
    description: {
      propDefinition: [
        brexApp,
        "cardActionDescription",
      ],
    },
  },
  async run({ $ }) {
    const card = await this.brexApp.terminateCard({
      $,
      cardId: this.cardId,
      data: {
        reason: this.reason,
        description: this.description,
      },
    });

    $.export(
      "$summary",
      `Cancelled card "${card.card_name}" ••${card.last_four} — status is now ${card.status}`,
    );

    return card;
  },
};
