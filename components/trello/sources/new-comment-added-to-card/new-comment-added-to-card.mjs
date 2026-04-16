import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-new-comment-added-to-card",
  name: "New Comment Added to Card (Instant)",
  description: "Emit new event for each new comment added to a card.",
  version: "0.2.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    list: {
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "List",
      description: "If specified, events will only be emitted when a comment is added to a card in the specified list",
    },
    cards: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
          list: c.list,
        }),
      ],
      description: "If specified, events will only be emitted when a comment is added to one of the specified cards",
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const cards = this.cards?.length
        ? this.cards
        : this.list
          ? (await this.app.getCardsInList({
            listId: this.list,
          })).map((card) => card.id)
          : (await this.app.getCards({
            boardId: this.board,
          })).map((card) => card.id);
      const actions = [];
      for (const card of cards) {
        const activities = await this.app.getCardActivity({
          cardId: card,
          params: {
            filter: "commentCard",
          },
        });

        for (const activity of activities) {
          actions.push(await this.getResult(activity));
        }
      }
      return actions;
    },
    getSortField() {
      return "date";
    },
    isCorrectEventType({ type }) {
      return type === "commentCard";
    },
    async getResult(action) {
      const card = await this.app.getCard({
        cardId: action?.data?.card?.id,
      });
      const member = await this.app.getMember({
        memberId: action?.idMemberCreator,
      });

      return {
        member,
        card,
        event: action,
      };
    },
    isRelevant({ result: { card } }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists || this.list === card.idList) &&
        (!this.cards?.length || this.cards.includes(card.id))
      );
    },
    generateMeta({ event }) {
      return {
        id: event?.action?.id ?? event?.id,
        summary: event?.action?.data?.text ?? event?.data?.text,
        ts: Date.parse(event?.date),
      };
    },
  },
  sampleEmit,
};
