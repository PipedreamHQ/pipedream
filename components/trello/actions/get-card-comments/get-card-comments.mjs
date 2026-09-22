import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-get-card-comments",
  name: "Get Card Comments",
  description: "Gets the comments on a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-actions-get).",
  version: "0.0.1",
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
      optional: true,
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
      description: "The ID or short link of the card to get comments for",
      optional: false,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page of results to return (0-based). Each page contains up to 1000 actions.",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const {
      cardId,
      page,
    } = this;

    const params = {
      filter: "commentCard",
    };

    if (page !== undefined) {
      params.page = page;
    }

    const res = await this.app.getCardActivity({
      $,
      cardId,
      params,
    });

    $.export("$summary", `Successfully retrieved ${res.length} comment(s) for card ${cardId}`);
    return res;
  },
};
