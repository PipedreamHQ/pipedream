import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-view",
  name: "Get View",
  description: "Get a view. [See the documentation](https://clickup.com/api) in **Views / Get View** section.",
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

    const response = await this.clickup.getView({
      $,
      viewId,
    });

    $.export("$summary", "Successfully retrieved view");

    return response;
  },
};
