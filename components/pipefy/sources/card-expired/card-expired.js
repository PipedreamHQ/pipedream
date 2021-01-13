const common = require("../common-polling.js");

module.exports = {
  ...common,
  name: "Card Expired",
  key: "pipefy-card-expired",
  description: "Emits an event each time a card becomes expired in a Pipe.",
  version: "0.0.1",
  methods: {
    isCardRelevant(node, due) {
      return node.expired && !node.done;
    },
    getEmitId(node) {
      return `${node.id}${node.current_phase.id}`;
    },
  },
};