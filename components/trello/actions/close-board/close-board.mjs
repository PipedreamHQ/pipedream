import common from "../common.mjs";

export default {
  ...common,
  key: "trello-close-board",
  name: "Close Board",
  description: "Closes a board. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    boardId: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      description: "The ID of the Board to close",
    },
  },
  async run({ $ }) {
    const res = await this.trello.closeBoard(this.boardId, $);
    $.export("$summary", `Successfully closed board ${this.boardId}`);
    return res;
  },
};
