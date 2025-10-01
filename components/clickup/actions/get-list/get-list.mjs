import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-list",
  name: "Get List",
  description: "Get a list. [See the documentation](https://clickup.com/api) in **Lists / Get List** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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

    const response = await this.clickup.getList({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list");

    return response;
  },
};
