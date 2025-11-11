import common from "../common/base.mjs";

export default {
  ...common,
  key: "planview_leankit-card-entered-a-lane",
  name: "New Card Entered a Specific Lane",
  description: "Emit new event when a card enters a specific lane.",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    ...common.props,
    laneId: {
      propDefinition: [
        common.props.planviewLeankit,
        "laneId",
        ({ boardId }) => ({
          boardId: boardId.value,
        }),
      ],
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    getFunc() {
      return this.planviewLeankit.listActivity;
    },
    validate(d) {
      return d.type === "cardMoved" && (d.data?.toLane?.id === this.laneId.value);
    },
    getSummary(data) {
      return `Card '${data.data.card.title}' entered the lane '${this.laneId.label}'`;
    },
  },
};
