const common = require("../common-polling.js");

module.exports = {
  ...common,
  name: "Card Late",
  key: "pipefy-card-late",
  description: "Emits an event each time a card becomes late in a Pipe.",
  version: "0.0.1",
  methods: {
    isCardRelevant(node, due) {
      return node.late && !node.done;
    },
    getEmitId(node) {
      return `${node.id}${node.current_phase.id}`;
    },
  },
};