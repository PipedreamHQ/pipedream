import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-attachment",
  name: "New Attachment (Instant)",
  description: "Emit new event when a new attachment is added on a board.",
  version: "0.1.0",
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
    isCorrectEventType(event) {
      return event.body?.action?.type === "addAttachmentToCard";
    },
    getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      const attachmentId = event.body?.action?.data?.attachment?.id;
      return this.app.getAttachment({
        cardId,
        attachmentId,
      });
    },
    isRelevant({ event }) {
      return (!this.board || this.board === event.body?.action?.data?.board?.id)
        && (!this.lists || this.lists.includes(event.body?.action?.data?.list?.id));
    },
  },
};
