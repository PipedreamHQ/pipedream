import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-get-card",
  name: "Get Card",
  description: "Gets a card by its ID. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-get).",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    cardId: {
      propDefinition: [
        common.props.app,
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
    customFieldItems: {
      propDefinition: [
        common.props.app,
        "customFieldItems",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.getCard({
      $,
      cardId: this.cardId,
      params: {
        customFieldItems: this.customFieldItems,
      },
    });
    $.export("$summary", `Successfully retrieved card ${this.cardId}`);
    return res;
  },
};
