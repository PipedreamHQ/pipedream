import common from "../common.mjs";

export default {
  ...common,
  key: "trello-close-board",
  name: "Close Board",
  description: "Closes a board. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put).",
  version: "0.1.0",
  type: "action",
  props: {
    ...common.props,
    boardId: {
      propDefinition: [
        common.props.app,
        "board",
      ],
      description: "The ID of the Board to close",
    },
  },
  async run({ $ }) {
    const res = await this.app.updateBoard({
      $,
      boardId: this.boardId,
      data: {
        closed: true,
      },
    });
    $.export("$summary", `Successfully closed board ${this.boardId}`);
    return res;
  },
};
