import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-view-comments",
  name: "Get View Comments",
  description: "Get a view comments. [See the documentation](https://clickup.com/api) in **Comments / Get Chat View Comments** section.",
  version: "0.0.13",
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
      optional: true,
    },
    viewId: {
      propDefinition: [
        common.props.clickup,
        "viewId",
        (c) => ({
          folderId: c.folderId,
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { viewId } = this;

    const response = await this.clickup.getViewComments({
      $,
      viewId,
    });

    $.export("$summary", "Successfully retrieved view comments");

    return response;
  },
};
