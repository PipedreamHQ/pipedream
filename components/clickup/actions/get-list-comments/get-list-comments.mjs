import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-list-comments",
  name: "Get List Comments",
  description: "Get a list comments. [See the documentation](https://clickup.com/api) in **Comments / Get List Comments** section.",
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

    const response = await this.clickup.getListComments({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list comments");

    return response;
  },
};
