import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-list-views",
  name: "Get List Views",
  description: "Get all views of a list. [See the documentation](https://clickup.com/api) in **Views / Get List Views** section.",
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
    },
  },
  async run({ $ }) {
    const { listId } = this;

    const response = await this.clickup.getListViews({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved list views");

    return response;
  },
};
