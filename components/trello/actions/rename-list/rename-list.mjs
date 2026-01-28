import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-rename-list",
  name: "Rename List",
  description: "Renames an existing list. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-lists/#api-lists-id-put).",
  version: "0.1.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    listId: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
        "name",
      ],
      description: "The new name of the list",
      optional: false,
    },
  },
  methods: {
    renameList({
      listId, ...args
    } = {}) {
      return this.app.put({
        path: `/lists/${listId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const res = await this.renameList({
      $,
      listId: this.listId,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully renamed list to \`${this.name}\`.`);
    return res;
  },
};
