import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-card-updates",
  name: "Card Updated (Instant)", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event for each update to a Trello card.",
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
    cards: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      let cards = [];
      const params = {
        customFieldItems: true,
      };
      if (this.cards?.length > 0) {
        for (const cardId of this.cards) {
          const card = await this.app.getCard({
            cardId,
            params,
          });
          cards.push(card);
        }
      } else {
        cards = await this.app.getCards({
          boardId: this.board,
          params,
        });
      }
      return cards;
    },
    getSortField() {
      return "dateLastActivity";
    },
    isCorrectEventType({ type }) {
      return type === "updateCard";
    },
    getResult({ data }) {
      return this.app.getCard({
        cardId: data?.card?.id,
        params: {
          customFieldItems: true,
        },
      });
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.cards?.length || this.cards.includes(card.id))
      );
    },
  },
  sampleEmit,
};
