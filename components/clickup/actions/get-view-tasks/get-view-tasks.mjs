import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-view-tasks",
  name: "Get View Tasks",
  description: "Get all tasks of a view. See the docs [here](https://clickup.com/api) in **Views  / Get View Tasks** section.",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
      optional: true,
    },
    viewId: {
      propDefinition: [
        clickup,
        "views",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          listId: c.listId,
          folderId: c.folderId,
        }),
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to be returned",
      min: 0,
      default: 0,
      optional: true,
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
