import common from "../common/base.mjs";

export default {
  ...common,
  key: "planview_leankit-card-updated-on-board",
  name: "New Card Updated On Board",
  description: "Emit new event when a card is updated on a board.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getFunc() {
      return this.planviewLeankit.listActivity;
    },
    validate(d) {
      return d.type === "cardChanged" || d.type === "userAssigned";
    },
    getSummary(data) {
      return `Card '${data.data.card.title}' was updated on the board '${this.boardId?.label || this.boardId}'`;
    },
  },
};
