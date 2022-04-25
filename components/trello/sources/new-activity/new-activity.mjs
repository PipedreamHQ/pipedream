import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-activity",
  name: "New Activity (Instant)",
  description: "Emit new event for new activity on a board.",
  version: "0.0.4",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResult(event) {
      return event.body;
    },
    isRelevant({ event }) {
      const boardId = event.body?.action?.data?.board?.id;
      return !this.board || this.board === boardId;
    },
    generateMeta({ action }) {
      const {
        id,
        type: summary,
        date,
      } = action;
      return {
        id,
        summary,
        ts: Date.parse(date),
      };
    },
  },
};
