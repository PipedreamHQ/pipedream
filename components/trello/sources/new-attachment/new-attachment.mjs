import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-attachment",
  name: "New Attachment (Instant)",
  description: "Emit new event for new attachment on a board.",
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
