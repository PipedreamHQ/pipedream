import common from "../common.mjs";

export default {
  ...common,
  key: "trello-find-labels",
  name: "Find a Label",
  description: "Finds a label on a specific board by name. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-labels-get)",
  version: "0.1.3",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      description: "Unique identifier of the board to search for labels",
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      label: "Label Name",
      description: "Name of the label to find.",
      optional: false,
    },
    labelLimit: {
      type: "integer",
      label: "Results",
      description: "The number of labels to be returned (up to 1000)",
      default: 50,
    },
  },
  async run({ $ }) {
    const opts = {
      limit: this.labelLimit,
    };
    const labels = await this.trello.findLabel(this.board, opts, $);
    const res = this.getMatches(labels, this.name);
    $.export("$summary", `Successfully retrieved ${res.length} label(s) with name ${this.name}`);
    return res;
  },
};
