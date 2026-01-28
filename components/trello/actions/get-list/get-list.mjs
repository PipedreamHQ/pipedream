import app from "../../trello.app.mjs";

export default {
  key: "trello-get-list",
  name: "Get List",
  description: "Get information about a List. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-lists/#api-lists-id-get).",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the Trello list",
      optional: false,
      propDefinition: [
        app,
        "lists",
        ({ boardId }) => ({
          board: boardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      listId,
    } = this;

    const response = await app.getList({
      $,
      listId,
    });

    $.export("$summary", `Successfully retrieved list ${listId}.`);

    return response;
  },
};
