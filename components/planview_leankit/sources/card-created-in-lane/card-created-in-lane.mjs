import common from "../common/base.mjs";

export default {
  ...common,
  key: "planview_leankit-card-created-in-lane",
  name: "New Card Created In A Specific Lane",
  description: "Emit new event when a card is created in a specific lane.",
  type: "source",
  version: "0.0.2",
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
      return d.type === "cardCreated" && (d.data?.lane?.id === this.laneId.value);
    },
    getSummary(data) {
      return `Card '${data.data.card.title}' was created in the lane '${this.laneId.label}'`;
    },
  },
};
