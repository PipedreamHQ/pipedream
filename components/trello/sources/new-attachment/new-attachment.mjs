import common from "../common-webhook.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-new-attachment",
  name: "New Attachment (Instant)",
  description: "Emit new event for new attachment on a board.",
  version: "0.0.2",
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
