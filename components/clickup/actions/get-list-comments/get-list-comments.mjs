import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-list-comments",
  name: "Get List Comments",
  description: "Get a list comments. See the docs [here](https://clickup.com/api) in **Comments  / Get List Comments** section.",
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
