import common from "../common/list-props.mjs";

export default {
  ...common,
  key: "clickup-get-view-tasks",
  name: "Get View Tasks",
  description: "Get all tasks of a view. [See the documentation](https://clickup.com/api) in **Views / Get View Tasks** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to be returned",
      min: 0,
      default: 0,
      optional: true,
    },
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
    const {
      viewId,
      page,
    } = this;

    const response = await this.clickup.getViewTasks({
      $,
      viewId,
      params: {
        page,
      },
    });

    $.export("$summary", "Successfully retrieved tasks");

    return response;
  },
};
