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
    getMemberCards({
      userId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/members/${userId}/cards`,
        ...args,
      });
    },
    async getSampleEvents() {
      const cards = await this.getMemberCards({
        userId: "me",
      });
      return {
        sampleEvents: cards,
        sortField: "dateLastActivity",
      };
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "addMemberToCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      return this.app.getCard({
        cardId,
      });
    },
    generateMeta({
      id, name: summary, dateLastActivity,
    }) {
      return {
        id: this.onlyEventsRelatedWithAuthenticatedUser ?
          id :
          `${id}${dateLastActivity}`,
        summary,
        ts: Date.now(),
      };
    },
  },
};
