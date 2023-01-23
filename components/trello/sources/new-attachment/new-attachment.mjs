import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-attachment",
  name: "New Attachment (Instant)",
  description: "Emit new event for new attachment on a board.",
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
        this.$emit(action, {
          id: action.id,
          summary: action?.data?.attachment?.name,
          ts: Date.parse(action.date),
        });
      }
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const actions = await this.trello.getBoardActivity(this.board, "addAttachmentToCard");
      return {
        sampleEvents: actions,
        sortField: "date",
      };
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "addAttachmentToCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      const attachmentId = event.body?.action?.data?.attachment?.id;
      return this.trello.getAttachment(cardId, attachmentId);
    },
    isRelevant({ event }) {
      const boardId = event.body?.action?.data?.board?.id;
      return !this.board || this.board === boardId;
    },
  },
};
