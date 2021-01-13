const common = require("../common-polling.js");

module.exports = {
  ...common,
  name: "Card Overdue",
  key: "pipefy-card-overdue",
  description: "Emits an event each time a card becomes overdue in a Pipe.",
  version: "0.0.1",
  methods: {
    isCardRelevant(node, due) {
      return (
        node.hasOwnProperty("due_date") &&
        due.getTime() < Date.now() &&
        !node.done
      );
    },
    getEmitId(node) {
      return node.id;
    },
  },
};