import common from "../common.mjs";

export default {
  ...common,
  key: "trello-create-comment-on-card",
  name: "Create Comment on Card",
  description: "Creates a new comment on a card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-actions-comments-post)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    idCard: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the card to create a new comment on",
      optional: false,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Text for the comment to be created.",
    },
  },
  async run({ $ }) {
    const res = await this.trello.createCommentOnCard(this.idCard, this.comment, $);
    $.export("$summary", `Successfully added comment to card ${this.idCard}`);
    return res;
  },
};
