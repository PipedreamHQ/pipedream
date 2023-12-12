import common from "../common.mjs";

export default {
  ...common,
  key: "trello-get-card",
  name: "Get Card",
  description: "Gets a card by its ID. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-get)",
  version: "0.1.6",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    cardId: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the card to get details of",
      optional: false,
    },
  },
  async run({ $ }) {
    const res = await this.trello.getCard(this.cardId, $);
    $.export("$summary", `Successfully retrieved card ${this.cardId}`);
    return res;
  },
};
