import common from "./common.mjs";

export default {
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
  async run(event) {
    const cards = await this.pipefy.listCards(this.pipeId);
    for (const edge of cards.edges) {
      const { node } = edge;
      if (!this.isCardRelevant({
        node,
        event,
      })) continue;
      const meta = this.getMeta({
        node,
        event,
      });
      this.$emit(node, meta);
    }
  },
};
