// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";

export default {
  key: "brex-unfreeze-card",
  name: "Unfreeze Card",
  description: "Unfreezes (unlocks) a `LOCKED` card so it can be used again. Cards cancelled with **Cancel Card** cannot be unfrozen. [See the documentation](https://developer.brex.com/openapi/team_api/cards/unlockcard)",
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
  },
  async run({ $ }) {
    const card = await this.brexApp.unlockCard({
      $,
      cardId: this.cardId,
    });

    $.export(
      "$summary",
      `Unfroze card "${card.card_name}" ••${card.last_four} — status is now ${card.status}`,
    );

    return card;
  },
};
