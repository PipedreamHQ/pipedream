import common from "../common.mjs";

export default {
  ...common,
  key: "trello-rename-list",
  name: "Rename List",
  description: "Renames an existing list. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-lists/#api-lists-id-put)",
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
    listId: {
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "List",
      description: "The ID of the List to rename",
      optional: false,
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      description: "The new name of the list",
      optional: false,
    },
  },
  async run({ $ }) {
    const res = await this.trello.renameList(this.listId, {
      name: this.name,
    }, $);
    $.export("$summary", `Successfully renamed list to ${this.name}`);
    return res;
  },
};
