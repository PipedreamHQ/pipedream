import common from "../common-webhook.mjs";

export default {
  ...common,
  name: "Card Moved (Instant)",
  key: "pipefy-card-moved",
  description: "Emits an event each time a card is moved in a Pipe.",
  version: "0.0.3",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return [
        "card.move",
      ];
    },
    getMeta(card, cardData) {
      return {
        body: cardData,
        id: `${card.id}${Date.now()}`,
        summary: `${card.title} moved from ${cardData.from.name} to ${cardData.to.name}`,
      };
    },
  },
};
