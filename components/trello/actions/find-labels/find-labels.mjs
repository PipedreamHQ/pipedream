import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-find-labels",
  name: "Find a Label",
  description: "Finds a label on a specific board by name. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-labels-get)",
  version: "0.2.5",
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
      description: "Unique identifier of the board to search for labels",
    },
    name: {
      propDefinition: [
        common.props.app,
        "name",
      ],
      label: "Label Name",
      description: "Name of the label to find.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of labels to be returned (up to 1000)",
      default: 50,
    },
  },
  async run({ $ }) {
    const labels = await this.app.findLabel({
      $,
      boardId: this.board,
      params: {
        limit: this.limit,
      },
    });
    const res = this.getMatches(labels, this.name);
    $.export("$summary", `Successfully retrieved ${res.length} label(s) with name ${this.name}`);
    return res;
  },
};
