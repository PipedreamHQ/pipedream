import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-get-folder-views",
  name: "Get Folder Views",
  description: "Get all views of a folder. See the docs [here](https://clickup.com/api) in **Views  / Get Folder Views** section.",
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
    },
  },
  async run({ $ }) {
    const { folderId } = this;

    return this.clickup.getFolderViews({
      $,
      folderId,
    });
  },
};
