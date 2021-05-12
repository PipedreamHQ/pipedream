const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "trello-card-due-date-reminder",
  name: "Card Due Date Reminder",
  description: "Emits an event at a specified time before a card is due.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [common.props.trello, "board"],
      default: "me",
    },
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
  },
  methods: {
    ...common.methods,
    generateMeta({ id, name: summary }, now) {
      return {
        id,
        summary,
        ts: now,
      };
    },
    emitEvent(card, now) {
      const meta = this.generateMeta(card, now);
      this.$emit(card, meta);
    },
  },
  async run(event) {
    const boardId = this.board;
    const now = event.timestamp * 1000;

    const cards = await this.trello.getCards(boardId);
    for (const card of cards) {
      if (!card.due) continue;
      const due = Date.parse(card.due);
      const notifyAt = due - this.timeBefore * this.timeBeforeUnit;
      if (notifyAt <= now) {
        this.emitEvent(card, now);
      }
    }
  },
};