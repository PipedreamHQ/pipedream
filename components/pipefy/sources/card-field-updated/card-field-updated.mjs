import common from "../common-webhook.mjs";

export default {
  ...common,
  name: "Card Field Updated (Instant)",
  key: "pipefy-card-field-updated",
  description: "Emits an event each time a card field is updated in a Pipe.",
  version: "0.0.3",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return [
        "card.field_update",
      ];
    },
    getMeta(card, cardData) {
      return {
        body: {
          card,
          cardData,
        },
        id: `${card.id}${Date.now()}`,
        summary: `${card.title} ${cardData.field.label} updated`,
      };
    },
  },
};
