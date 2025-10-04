import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-find-list",
  name: "Find a List",
  description: "Finds a list on a specific board by name. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-lists-get).",
  version: "0.2.4",
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
      description: "Specify the board to search for lists",
    },
    name: {
      propDefinition: [
        common.props.app,
        "name",
      ],
      label: "List Name",
      description: "Name of the list to find.",
      optional: false,
    },
    listFilter: {
      propDefinition: [
        common.props.app,
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
    const lists = await this.app.getLists({
      $,
      boardId: board,
      params: {
        filter: listFilter,
      },
    });
    const res = this.getMatches(lists, name);
    $.export("$summary", `Successfully retrieved ${res.length} list(s) with name ${name}`);
    return res;
  },
};
