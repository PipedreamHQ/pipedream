import common from "../common/base.mjs";

export default {
  ...common,
  key: "planview_leankit-card-moved-on-board",
  name: "New Card Moved On Board",
  description: "Emit new event when a card is moved on a board.",
  type: "source",
  version: "0.0.1",
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
      return d.type === "cardMoved";
    },
    getSummary(data) {
      return `Card '${data.data.card.title}' was moved on the board '${this.boardId.label}'`;
    },
  },
};
