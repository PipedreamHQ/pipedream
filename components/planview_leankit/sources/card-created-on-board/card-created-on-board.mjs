import common from "../common/base.mjs";

export default {
  ...common,
  key: "planview_leankit-card-created-on-board",
  name: "New Card Created On Board",
  description: "Emit new event when a card is created on a board.",
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
      return d.type === "cardCreated";
    },
    getSummary(data) {
      return `Card '${data.data.card.title}' was created on the board '${this.boardId.label}'`;
    },
  },
};
