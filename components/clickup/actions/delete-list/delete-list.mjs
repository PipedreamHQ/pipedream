import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-delete-list",
  name: "Delete List",
  description: "Delete a list. [See the documentation](https://clickup.com/api) in **Lists / Delete List** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { listId } = this;

    const response = await this.clickup.deleteList({
      $,
      listId,
    });

    $.export("$summary", "Successfully deleted list");

    return response;
  },
};
