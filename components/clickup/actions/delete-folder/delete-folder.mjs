import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-delete-folder",
  name: "Delete Folder",
  description: "Delete a folder. See the docs [here](https://clickup.com/api) in **Folders  / Delete Folder** section.",
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

    return this.clickup.deleteFolder({
      $,
      folderId,
    });
  },
};
