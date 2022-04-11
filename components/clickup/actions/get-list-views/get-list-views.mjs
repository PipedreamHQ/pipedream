import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-list-views",
  name: "Get List Views",
  description: "Get all views of a list. See the docs [here](https://clickup.com/api) in **Views  / Get List Views** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
      optional: true,
    },
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
        }),
      ],
    },
  },
  async run({ $ }) {
    const { listId } = this;

    return this.clickup.getListViews({
      $,
      listId,
    });
  },
};
