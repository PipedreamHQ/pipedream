import common from "../common/common.mjs";

export default {
  ...common,
  name: "New User Rating",
  version: "0.0.1",
  key: "nicereply-new-user-rating",
  description: "Emit new event on each new user rating.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.nicereply,
        "userId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New user rating with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getRatings() {
      return this.nicereply.getUserRatings;
    },
    getRequestExtraArgs() {
      return {
        userId: this.userId,
      };
    },
  },
};
