import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-new-attachment",
  name: "New Attachment (Instant)",
  description: "Emit new event when a new attachment is added on a board.",
  version: "0.1.4",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    lists: {
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      description: "If specified, events will only be emitted when an attachment is added to a card in one of the specified lists",
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const cards = this.lists?.length
        ? await this.app.getCardsInList({
          listId: this.lists[0],
        })
        : await this.app.getCards({
          boardId: this.board,
        });
      const attachments = [];
      for (const card of cards) {
        const cardAttachments = await this.app.listCardAttachments({
          cardId: card.id,
        });
        attachments.push(...cardAttachments);
      }
      return attachments;
    },
    getSortField() {
      return "date";
    },
    isCorrectEventType({ type }) {
      return type === "addAttachmentToCard";
    },
    getResult({ data }) {
      return this.app.getAttachment({
        cardId: data?.card?.id,
        attachmentId: data?.attachment?.id,
      });
    },
    isRelevant({ action }) {
      return (!this.board || this.board === action?.data?.board?.id)
        && (!this.lists?.length || this.lists.includes(action?.data?.list?.id));
    },
  },
  sampleEmit,
};
