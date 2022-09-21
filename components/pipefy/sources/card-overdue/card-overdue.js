const common = require("../common-polling.js");

module.exports = {
  ...common,
  name: "Card Overdue",
  key: "pipefy-card-overdue",
  description: "Emits an event each time a card becomes overdue in a Pipe.",
  version: "0.0.2",
  type: "source",
  methods: {
    isCardRelevant({
      node, event,
    }) {
      const { timestamp: eventTimestamp } = event;
      const eventDate = eventTimestamp * 1000;
      const { due_date: dueDateIso } = node;
      const dueDate = Date.parse(dueDateIso);
      return (
        dueDate < eventDate &&
        !node.done
      );
    },
    getMeta({
      node, event,
    }) {
      const {
        id,
        title: summary,
        due_date: dueDate,
      } = node;
      const { timestamp: eventTimestamp } = event;
      const ts = Date.parse(dueDate) || eventTimestamp;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
