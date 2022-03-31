import common from "../board-based.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-new-member-on-card",
  name: "New Member on Card (Instant)",
  description:
    "Emit new event for each card joined by the authenticated Trello user.",
  version: "0.0.7",
  type: "source",
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
