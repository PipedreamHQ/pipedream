const common = require("./common.js");

module.exports = {
  ...common,
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run() {
    const cards = await this.pipefy.listCards(this.pipeId);
    for (const edge of cards.edges) {
      const { node } = edge;
      const { due_date } = node;
      const due = due_date ? new Date(due_date) : new Date();
      if (!this.isCardRelevant(node, due)) continue;
      this.$emit(node, {
        id: this.getEmitId(node),
        summary: node.title,
        ts: due.getTime(),
      });
    }
  },
};