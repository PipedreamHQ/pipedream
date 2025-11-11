import common from "../common/base.mjs";

export default {
  ...common,
  key: "planview_leankit-card-assigned-to-user",
  name: "New Card Assigned To User",
  description: "Emit new event when a card is assigned to a user.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.planviewLeankit,
        "userId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunc() {
      return this.planviewLeankit.listActivity;
    },
    validate(d) {
      return d.type === "userAssigned" && d.data.user.id === this.userId;
    },
    getSummary(data) {
      return `Card '${data.data.card.title}' assigned to user '${data.data.user.id}'`;
    },
  },
};
