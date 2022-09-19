import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-view-comments",
  name: "Get View Comments",
  description: "Get a view comments. See the docs [here](https://clickup.com/api) in **Comments  / Get Chat View Comments** section.",
  version: "0.0.2",
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
