import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-card-moved",
  name: "Card Moved (Instant)", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event each time a card is moved to a list.",
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
      description: "If specified, events will only be emitted if a card is moved to or from one of the selected lists",
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const cards = this.lists?.length > 0
        ? await this.app.getCardsInList({
          listId: this.lists[0],
        })
        : await this.app.getCards({
          boardId: this.board,
        });
      return cards;
    },
    getSortField() {
      return "dateLastActivity";
    },
    _getListAfter() {
      return this.db.get("listAfter");
    },
    _setListAfter(listAfter) {
      this.db.set("listAfter", listAfter);
    },
    isCorrectEventType({ display }) {
      return display?.translationKey === "action_move_card_from_list_to_list";
    },
    getResult({ data }) {
      /** Record listAfter to use in generateMeta() */
      this._setListAfter(data?.listAfter?.name);
      return this.app.getCard({
        cardId: data?.card?.id,
      });
    },
    isRelevant({
      result: card, action,
    }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists?.length ||
          this.lists.includes(action?.data?.listAfter?.id) ||
          this.lists.includes(action?.data?.listBefore?.id))
      );
    },
    generateMeta({
      id, name,
    }) {
      const listAfter = this._getListAfter();
      name = name || id;
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
  sampleEmit,
};
