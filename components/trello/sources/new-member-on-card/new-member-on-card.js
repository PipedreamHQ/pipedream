const common = require("../board-based.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-member-on-card",
  name: "New Member on Card (Instant)",
  description:
    "Emits an event for each card joined by the authenticated Trello user.",
  version: "0.0.5",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "addMemberToCard";
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      return await this.trello.getCard(cardId);
    },
  },
};