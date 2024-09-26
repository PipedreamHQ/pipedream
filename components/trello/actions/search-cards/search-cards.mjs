import common from "../common.mjs";

export default {
  ...common,
  key: "trello-search-cards",
  name: "Search Cards",
  description: "Searches for cards matching the specified query. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get).",
  version: "0.2.0",
  type: "action",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        common.props.app,
        "query",
      ],
    },
    idBoards: {
      propDefinition: [
        common.props.app,
        "board",
      ],
      type: "string[]",
      label: "Boards",
      description: "The IDs of boards to search for cards in",
    },
    partial: {
      propDefinition: [
        common.props.app,
        "partial",
      ],
    },
    cardFields: {
      propDefinition: [
        common.props.app,
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
    const { cards } = await this.app.search({
      $,
      params: {
        query: this.query,
        idBoards: this.idBoards,
        modelTypes: "cards",
        card_fields: this.cardFields,
        cards_limit: this.cardsLimit,
        partial: this.partial,
      },
    });
    $.export("$summary", `Successfully retrieved ${cards.length} card(s)`);
    return cards;
  },
};
