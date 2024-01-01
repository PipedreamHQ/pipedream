import common from "../common.mjs";

export default {
  ...common,
  key: "trello-find-list",
  name: "Find a List",
  description: "Finds a list on a specific board by name. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-lists-get)",
  version: "0.1.3",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      description: "Specify the board to search for lists",
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      label: "List Name",
      description: "Name of the list to find.",
      optional: false,
    },
    listFilter: {
      propDefinition: [
        common.props.trello,
        "listFilter",
      ],
    },
  },
  async run({ $ }) {
    const {
      board,
      name,
      listFilter,
    } = this;
    const opts = {
      filter: listFilter,
    };
    const lists = await this.trello.findList(board, opts, $);
    const res = this.getMatches(lists, name);
    $.export("$summary", `Successfully retrieved ${res.length} list(s) with name ${name}`);
    return res;
  },
};
