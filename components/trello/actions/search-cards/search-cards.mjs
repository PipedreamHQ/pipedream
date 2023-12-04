import common from "../common.mjs";

export default {
  ...common,
  key: "trello-search-cards",
  name: "Search Cards",
  description: "Searches for cards matching the specified query. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get)",
  version: "0.1.3",
  type: "action",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        common.props.trello,
        "query",
      ],
    },
    idBoards: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      type: "string[]",
      label: "Boards",
      description: "The IDs of boards to search for cards in",
    },
    partial: {
      propDefinition: [
        common.props.trello,
        "partial",
      ],
    },
    cardFields: {
      propDefinition: [
        common.props.trello,
        "cardFields",
      ],
    },
    cardsLimit: {
      type: "integer",
      label: "Cards Limit",
      description: "The maximum number of cards to return.",
      default: 10,
    },
  },
  async run({ $ }) {
    const opts = {
      query: this.query,
      idBoards: this.idBoards,
      modelTypes: "cards",
      card_fields: this.cardFields,
      cards_limit: this.cardsLimit,
      partial: this.partial,
    };
    const { cards } = await this.trello.searchCards(opts, $);
    $.export("$summary", `Successfully retrieved ${cards.length} card(s)`);
    return cards;
  },
};
