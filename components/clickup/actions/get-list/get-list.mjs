import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-list",
  name: "Get List",
  description: "Get a list. See the docs [here](https://clickup.com/api) in **Lists  / Get List** section.",
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
