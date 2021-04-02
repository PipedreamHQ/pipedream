const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "Card Created (Instant)",
  key: "pipefy-card-created",
  description: "Emits an event for each new card created in a Pipe.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    getActions() {
      return ["card.create"];
    },
    getMeta(card, cardData) {
      return {
        body: { card, cardData },
        id: card.id,
        summary: card.title,
      };
    },
  },
};