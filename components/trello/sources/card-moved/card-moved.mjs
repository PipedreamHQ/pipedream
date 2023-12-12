import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-card-moved",
  name: "Card Moved (Instant)",
  description: "Emit new event each time a card is moved to a list.",
  version: "0.0.11",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    lists: {
      propDefinition: [
        common.props.trello,
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
      const cards = this.lists && this.lists.length > 0
        ? await this.trello.getCardsInList(this.lists[0])
        : await this.trello.getCards(this.board);
      return {
        sampleEvents: cards,
        sortFilter: "dateLastActivity",
      };
    },
    _getListAfter() {
      return this.db.get("listAfter");
    },
    _setListAfter(listAfter) {
      this.db.set("listAfter", listAfter);
    },
    isCorrectEventType(event) {
      const eventTranslationKey = event.body?.action?.display?.translationKey;
      return eventTranslationKey === "action_move_card_from_list_to_list";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      const listAfter = event.body?.action?.data?.listAfter?.name;
      /** Record listAfter to use in generateMeta() */
      this._setListAfter(listAfter);
      return this.trello.getCard(cardId);
    },
    isRelevant({
      result: card, event,
    }) {
      const listIdAfter = event.body?.action?.data?.listAfter?.id;
      const listIdBefore = event.body?.action?.data?.listBefore?.id;

      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists ||
          this.lists.length === 0 ||
          this.lists.includes(listIdAfter) ||
          this.lists.includes(listIdBefore))
      );
    },
    generateMeta({
      id, name,
    }) {
      const listAfter = this._getListAfter();
      const summary = listAfter
        ? `${name} - moved to ${listAfter}`
        : name;
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
  },
};
