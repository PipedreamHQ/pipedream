import common from "../common/common-board-based.mjs";

export default {
  ...common,
  key: "trello-new-member-on-card",
  name: "New Member on Card (Instant)",
  description: "Emit new event for each member that join in a card.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleEvents() {
      return this.app.getMemberCards({
        userId: "me",
      });
    },
    getSortField() {
      return "dateLastActivity";
    },
    isCorrectEventType(event) {
      return event.body?.action?.type === "addMemberToCard";
    },
    getResult(event) {
      return this.app.getCard({
        cardId: event.body?.action?.data?.card?.id,
      });
    },
    generateMeta({
      id, name, dateLastActivity,
    }) {
      return {
        id: this.onlyEventsRelatedWithAuthenticatedUser
          ? id
          : `${id}${dateLastActivity}`,
        summary: name || id,
        ts: Date.now(),
      };
    },
  },
};
