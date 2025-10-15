import app from "../../trello.app.mjs";

export default {
  key: "trello-add-comment",
  name: "Add Comment",
  description: "Create a new comment on a specific card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-actions-comments-post).",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "board",
      ],
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card.",
      optional: false,
      propDefinition: [
        app,
        "cards",
        ({ boardId }) => ({
          board: boardId,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Comment",
      description: "The comment to add.",
    },
  },
  methods: {
    addComment({
      cardId, ...args
    } = {}) {
      return this.app.post({
        path: `/cards/${cardId}/actions/comments`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      cardId,
      text,
    } = this;

    const response = await this.app.addComment({
      $,
      cardId,
      params: {
        text,
      },
    });

    $.export("$summary", `Successfully added comment with ID: ${response.id}`);

    return response;
  },
};
