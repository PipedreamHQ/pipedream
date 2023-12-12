import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-activity",
  name: "New Activity (Instant)",
  description: "Emit new event for new activity on a board.",
  version: "0.0.8",
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
  hooks: {
    ...common.hooks,
    async deploy() {
      const {
        sampleEvents, sortField,
      } = await this.getSampleEvents();
      sampleEvents.sort((a, b) => (Date.parse(a[sortField]) > Date.parse(b[sortField]))
        ? 1
        : -1);
      for (const action of sampleEvents.slice(-25)) {
        this.emitEvent({
          action,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const actions = await this.trello.getBoardActivity(this.board);
      return {
        sampleEvents: actions,
        sortField: "date",
      };
    },
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
