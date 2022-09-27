import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Team Rating",
  version: "0.0.1",
  key: "nicereply-new-team-rating",
  description: "Emit new event on each new team rating.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.nicereply,
        "teamId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New team rating with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getRatings() {
      return this.nicereply.getTeamsRatings;
    },
    getRequestExtraArgs() {
      return {
        teamId: this.teamId,
      };
    },
  },
};
