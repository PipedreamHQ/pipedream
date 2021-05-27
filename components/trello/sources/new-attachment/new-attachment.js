const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-attachment",
  name: "New Attachment (Instant)",
  description: "Emits an event for new attachment on a board.",
  version: "0.0.1",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "addAttachmentToCard";
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      const attachmentId = get(event, "body.action.data.attachment.id");
      return await this.trello.getAttachment(cardId, attachmentId);
    },
    isRelevant({ event }) {
      const boardId = get(event, "body.action.data.board.id");
      return !this.board || this.board === boardId;
    },
  },
};