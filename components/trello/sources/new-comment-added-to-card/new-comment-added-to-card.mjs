import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-comment-added-to-card",
  name: "New Comment Added to Card (Instant)",
  description: "Emit new event for each new comment added to a card.",
  version: "0.0.10",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    cards: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
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
        this._setComment(action?.data?.text);
        this.emitEvent(action);
      }
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const cards = this.cards && this.cards.length > 0
        ? this.cards
        : (await this.trello.getCards(this.board)).map((card) => card.id);
      const actions = [];
      for (const card of cards) {
        const activities = await this.trello.getCardActivity(card, "commentCard");
        actions.push(...activities);
      }
      return {
        sampleEvents: actions,
        sortField: "date",
      };
    },
    _getComment() {
      return this.db.get("comment");
    },
    _setComment(comment) {
      this.db.set("comment", comment);
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "commentCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      const comment = event.body?.action?.data?.text;
      /** Record comment to use in generateMeta() */
      this._setComment(comment);
      return this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(card.id))
      );
    },
    generateMeta({
      id, dateLastActivity,
    }) {
      const comment = this._getComment();
      return {
        id: `${id}${dateLastActivity}`,
        summary: comment,
        ts: Date.parse(dateLastActivity),
      };
    },
  },
};
