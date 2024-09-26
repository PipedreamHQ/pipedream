import common from "../common.mjs";

export default {
  ...common,
  key: "trello-create-comment-on-card",
  name: "Create Comment on Card",
  description: "Creates a new comment on a card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-actions-comments-post).",
  version: "0.1.0",
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
        ({ board }) => ({
          board,
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
  methods: {
    ...common.methods,
    createCommentOnCard({
      cardId, ...args
    } = {}) {
      return this.app.post({
        path: `/cards/${cardId}/actions/comments`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const res = await this.createCommentOnCard({
      $,
      cardId: this.cardId,
      params: {
        text: this.comment,
      },
    });
    $.export("$summary", `Successfully added comment to card ${this.cardId}`);
    return res;
  },
};
