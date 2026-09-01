// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";

export default {
  key: "brex-freeze-card",
  name: "Freeze Card",
  description: "Freezes (locks) a card so it declines new purchases. Reversible with **Unfreeze Card**. [See the documentation](https://developer.brex.com/openapi/team_api/cards/lockcard)",
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
    reason: {
      propDefinition: [
        brexApp,
        "cardActionReason",
      ],
      description: "Why the card is being frozen. Brex requires a reason and records it against the card.",
    },
    description: {
      propDefinition: [
        brexApp,
        "cardActionDescription",
      ],
    },
  },
  async run({ $ }) {
    const card = await this.brexApp.lockCard({
      $,
      cardId: this.cardId,
      data: {
        reason: this.reason,
        description: this.description,
      },
    });

    $.export(
      "$summary",
      `Froze card "${card.card_name ?? card.id}" ••${card.last_four} — status is now ${card.status}`,
    );

    return card;
  },
};
