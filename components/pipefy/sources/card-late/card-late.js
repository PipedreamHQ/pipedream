const pipefy = require("../../pipefy.app.js");

module.exports = {
  name: "Card Late",
  key: "pipefy-card-late",
  description: "Emits an event each time a card becomes late in a Pipe.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    pipefy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    pipeId: {
      type: "integer",
      label: "Pipe ID",
      description: "ID of the Pipe, found in the URL when viewing the Pipe.",
    },
  },
  async run() {
    const cards = await this.pipefy.listCards(this.pipeId);
    for (const edge of cards.edges) {
      const { node } = edge;
      const { due_date } = node;
      const due = due_date ? new Date(due_date) : new Date();
      if (!node.late || node.done) continue;
      this.$emit(node, {
        id: `${node.id}${node.current_phase.id}`,
        summary: node.title,
        ts: due.getTime(),
      });
    }
  },
};