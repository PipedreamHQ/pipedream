import common from "../common-webhook.mjs";

export default {
  ...common,
  name: "Card Done (Instant)",
  key: "pipefy-card-done",
  description: "Emits an event each time a card is moved to Done a Pipe.",
  version: "0.0.3",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return [
        "card.done",
      ];
    },
    getMeta(card, cardData) {
      return {
        body: {
          card,
          cardData,
        },
        id: `${card.id}${Date.now()}`,
        summary: `${card.title} Done`,
      };
    },
  },
};
