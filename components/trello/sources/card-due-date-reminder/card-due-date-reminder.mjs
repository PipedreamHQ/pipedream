import ms from "ms";
import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "trello-card-due-date-reminder",
  name: "Card Due Date Reminder",
  description: "Emit new event at a specified time before a card is due.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    timeBefore: {
      type: "string",
      label: "Time Before",
      description: "How far before the due time the event should trigger. For example, `5 minutes`, `10 minutes`, `1 hour`.",
      default: "5 minutes",
      options: [
        "5 minutes",
        "10 minutes",
        "15 minutes",
        "30 minutes",
        "1 hour",
        "2 hours",
        "3 hours",
        "6 hours",
        "12 hours",
        "1 day",
        "2 days",
        "3 days",
        "1 week",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta({
      id, name: summary,
    }, now) {
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

    const timeBeforeMs = ms(this.timeBefore);
    if (!timeBeforeMs) {
      throw new Error(`Invalid timeBefore value: ${this.timeBefore}`);
    }

    const cards = await this.app.getCards({
      boardId,
    });
    for (const card of cards) {
      if (!card.due) {
        continue;
      }
      const due = Date.parse(card.due);
      const notifyAt = due - timeBeforeMs;
      if (notifyAt <= now) {
        this.emitEvent(card, now);
      }
    }
  },
};
