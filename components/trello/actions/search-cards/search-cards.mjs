import app from "../../trello.app.mjs";

export default {
  key: "trello-search-cards",
  name: "Search Cards",
  description: "Searches for cards matching the specified query. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get).",
  version: "0.2.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    idBoards: {
      propDefinition: [
        app,
        "board",
      ],
      type: "string[]",
      label: "Boards",
      description: "The IDs of boards to search for cards in",
      optional: true,
    },
    partial: {
      propDefinition: [
        app,
        "partial",
      ],
      optional: true,
    },
    cardFields: {
      propDefinition: [
        app,
        "cardFields",
      ],
      optional: true,
    },
    cardsLimit: {
      type: "integer",
      label: "Cards Limit",
      description: "The maximum number of cards to return.",
      default: 10,
      optional: true,
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
