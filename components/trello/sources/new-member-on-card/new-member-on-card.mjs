import common from "../board-based.mjs";

export default {
  ...common,
  key: "trello-new-member-on-card",
  name: "New Member on Card (Instant)",
  description: "Emit new event for each card joined by the authenticated Trello user.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "addMemberToCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      return this.trello.getCard(cardId);
    },
  },
};
