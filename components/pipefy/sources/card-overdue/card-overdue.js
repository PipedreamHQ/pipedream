const pipefy = require("../../pipefy.app.js");

module.exports = {
  name: "Card Overdue",
  key: "pipefy-card-overdue",
  description: "Emits an event each time a card becomes overdue in a Pipe.",
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
      if (!due_date) continue;
      const due = new Date(due_date);
      if (due.getTime() > Date.now() || node.done) continue;
      this.$emit(node, {
        id: node.id,
        summary: node.title,
        ts: due.getTime(),
      });
    }
  },
};