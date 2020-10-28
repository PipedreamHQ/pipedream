const trello = require("../../trello.app.js");

module.exports = {
  key: "trello-card-due-date-reminder",
  name: "Card Due Date Reminder",
  description: "Emits an event at a specified time before a card is due.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    trello,
    boardId: { propDefinition: [trello, "boardId"] },
    timeBefore: {
      type: "integer",
      label: "Time Before",
      description: "How far before the due time the event should trigger.",
      default: 5,
    },
    timeBeforeUnit: {
      type: "string",
      label: "Time Before (Unit)",
      description: "Unit of time for Time Before.",
      async options() {
        return [
          { label: "Minutes", value: 60000 },
          { label: "Hours", value: 3600000 },
          { label: "Days", value: 86400000 },
          { label: "Weeks", value: 604800000 },
        ];
      },
      default: "Minutes",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    const cards = [];
    let results = [];
    let due, notifyAt;
    const boardId = this.boardId ? this.boardId : "me";
    const now = new Date();

    results = await this.trello.getCards(boardId);
    for (const card of results) {
      if (card.due) {
        due = new Date(card.due);
        notifyAt = new Date(
          due.getTime() - this.timeBefore * this.timeBeforeUnit
        );
        if (notifyAt.getTime() <= now.getTime()) {
          this.$emit(card, {
            id: card.id,
            summary: card.name,
            ts: Date.now(),
          });
        }
      }
    }
  },
};